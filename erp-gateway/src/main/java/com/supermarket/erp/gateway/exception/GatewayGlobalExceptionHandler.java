package com.supermarket.erp.gateway.exception;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.supermarket.erp.common.logging.LogContextConstants;
import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.gateway.filter.GatewayLogContextSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.ServerWebInputException;
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import reactor.core.publisher.Mono;

import java.net.ConnectException;

@Component
@Order(-2)
public class GatewayGlobalExceptionHandler implements ErrorWebExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GatewayGlobalExceptionHandler.class);

    private final ObjectMapper objectMapper;
    private final GatewayLogContextSupport logContextSupport;

    public GatewayGlobalExceptionHandler(ObjectMapper objectMapper, GatewayLogContextSupport logContextSupport) {
        this.objectMapper = objectMapper;
        this.logContextSupport = logContextSupport;
    }

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        if (exchange.getResponse().isCommitted()) {
            return Mono.error(ex);
        }

        HttpStatus status = resolveStatus(ex);
        String requestId = logContextSupport.getRequestId(exchange);
        String message = resolveMessage(status, ex);

        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
        exchange.getResponse().getHeaders().set(LogContextConstants.REQUEST_ID_HEADER, requestId);

        logContextSupport.withMdc(exchange, () -> {
            if (status.is5xxServerError()) {
                log.error("gateway exception status={} detail={}", status.value(), ex.getMessage(), ex);
                return;
            }
            log.warn("gateway exception status={} detail={}", status.value(), ex.getMessage());
        });

        byte[] body = serializeBody(CommonResult.error(status.value(), message));
        return exchange.getResponse().writeWith(Mono.just(exchange.getResponse().bufferFactory().wrap(body)));
    }

    private HttpStatus resolveStatus(Throwable ex) {
        if (ex instanceof ResponseStatusException responseStatusException) {
            return HttpStatus.valueOf(responseStatusException.getStatusCode().value());
        }
        if (ex instanceof ServerWebInputException || ex instanceof IllegalArgumentException) {
            return HttpStatus.BAD_REQUEST;
        }
        if (findCause(ex, ConnectException.class) != null) {
            return HttpStatus.SERVICE_UNAVAILABLE;
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    private String resolveMessage(HttpStatus status, Throwable ex) {
        if (status == HttpStatus.SERVICE_UNAVAILABLE) {
            return "Service unavailable";
        }
        if (status.is5xxServerError()) {
            return "Internal server error";
        }
        if (ex instanceof ServerWebInputException) {
            return "Invalid request";
        }
        if (ex instanceof ResponseStatusException responseStatusException
                && StringUtils.hasText(responseStatusException.getReason())) {
            return responseStatusException.getReason();
        }
        return status.getReasonPhrase();
    }

    private byte[] serializeBody(CommonResult<?> body) {
        try {
            return objectMapper.writeValueAsBytes(body);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Failed to serialize gateway error body", exception);
        }
    }

    private <T extends Throwable> T findCause(Throwable ex, Class<T> type) {
        Throwable current = ex;
        while (current != null) {
            if (type.isInstance(current)) {
                return type.cast(current);
            }
            current = current.getCause();
        }
        return null;
    }
}
