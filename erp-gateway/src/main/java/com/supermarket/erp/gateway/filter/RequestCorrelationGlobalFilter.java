package com.supermarket.erp.gateway.filter;

import com.supermarket.erp.common.logging.LogContextConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class RequestCorrelationGlobalFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(RequestCorrelationGlobalFilter.class);

    private final GatewayLogContextSupport logContextSupport;

    public RequestCorrelationGlobalFilter(GatewayLogContextSupport logContextSupport) {
        this.logContextSupport = logContextSupport;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long startedAt = System.currentTimeMillis();
        String requestId = logContextSupport.getRequestId(exchange);
        ServerWebExchange mutatedExchange = exchange.mutate()
                .request(request -> request.headers(headers -> headers.set(LogContextConstants.REQUEST_ID_HEADER, requestId)))
                .build();

        logContextSupport.initialize(mutatedExchange);
        logContextSupport.withMdc(mutatedExchange, () -> log.info("gateway request started"));
        mutatedExchange.getResponse().beforeCommit(() -> {
            mutatedExchange.getResponse().getHeaders().set(LogContextConstants.REQUEST_ID_HEADER, requestId);
            logContextSupport.withMdc(mutatedExchange, () -> log.info("gateway request completed status={} durationMs={}",
                    resolveStatus(mutatedExchange),
                    System.currentTimeMillis() - startedAt));
            return Mono.empty();
        });

        return chain.filter(mutatedExchange)
                .doOnError(ex -> logContextSupport.withMdc(mutatedExchange,
                        () -> log.warn("gateway request failed detail={}", ex.getMessage())));
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    private int resolveStatus(ServerWebExchange exchange) {
        HttpStatusCode statusCode = exchange.getResponse().getStatusCode();
        return statusCode != null ? statusCode.value() : 200;
    }
}
