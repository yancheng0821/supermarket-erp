package com.supermarket.erp.gateway.exception;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.supermarket.erp.common.logging.LogContextConstants;
import com.supermarket.erp.gateway.filter.GatewayLogContextSupport;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.web.server.ResponseStatusException;

import java.net.ConnectException;

import static org.assertj.core.api.Assertions.assertThat;

class GatewayGlobalExceptionHandlerTest {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final GatewayGlobalExceptionHandler handler =
            new GatewayGlobalExceptionHandler(objectMapper, new GatewayLogContextSupport());

    @Test
    void shouldRenderResponseStatusExceptionAsCommonResult() throws Exception {
        MockServerWebExchange exchange = MockServerWebExchange.from(
                MockServerHttpRequest.get("/bad")
                        .header(LogContextConstants.REQUEST_ID_HEADER, "req-123")
                        .build());

        handler.handle(exchange, new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bad route")).block();

        JsonNode body = objectMapper.readTree(exchange.getResponse().getBodyAsString().block());
        assertThat(exchange.getResponse().getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(exchange.getResponse().getHeaders().getFirst(LogContextConstants.REQUEST_ID_HEADER))
                .isEqualTo("req-123");
        assertThat(body.get("code").asInt()).isEqualTo(400);
        assertThat(body.get("msg").asText()).isEqualTo("Bad route");
    }

    @Test
    void shouldRenderConnectFailuresAsServiceUnavailable() throws Exception {
        MockServerWebExchange exchange = MockServerWebExchange.from(MockServerHttpRequest.get("/downstream").build());

        handler.handle(exchange, new ConnectException("Connection refused")).block();

        JsonNode body = objectMapper.readTree(exchange.getResponse().getBodyAsString().block());
        assertThat(exchange.getResponse().getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
        assertThat(exchange.getResponse().getHeaders().getFirst(LogContextConstants.REQUEST_ID_HEADER)).isNotBlank();
        assertThat(body.get("code").asInt()).isEqualTo(503);
        assertThat(body.get("msg").asText()).isEqualTo("Service unavailable");
    }

    @Test
    void shouldFallbackToInternalServerErrorForUnknownException() throws Exception {
        MockServerWebExchange exchange = MockServerWebExchange.from(MockServerHttpRequest.get("/boom").build());

        handler.handle(exchange, new RuntimeException("boom")).block();

        JsonNode body = objectMapper.readTree(exchange.getResponse().getBodyAsString().block());
        assertThat(exchange.getResponse().getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(exchange.getResponse().getHeaders().getFirst(LogContextConstants.REQUEST_ID_HEADER)).isNotBlank();
        assertThat(body.get("code").asInt()).isEqualTo(500);
        assertThat(body.get("msg").asText()).isEqualTo("Internal server error");
    }
}
