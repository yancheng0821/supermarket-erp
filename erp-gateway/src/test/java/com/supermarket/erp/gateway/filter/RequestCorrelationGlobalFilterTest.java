package com.supermarket.erp.gateway.filter;

import com.supermarket.erp.common.logging.LogContextConstants;
import org.junit.jupiter.api.Test;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;

class RequestCorrelationGlobalFilterTest {

    private final RequestCorrelationGlobalFilter filter =
            new RequestCorrelationGlobalFilter(new GatewayLogContextSupport());

    @Test
    void shouldGenerateAndPropagateRequestIdWhenHeaderMissing() {
        MockServerWebExchange exchange = MockServerWebExchange.from(MockServerHttpRequest.get("/api/test").build());
        AtomicReference<ServerWebExchange> forwardedExchange = new AtomicReference<>();
        GatewayFilterChain chain = currentExchange -> {
            forwardedExchange.set(currentExchange);
            currentExchange.getResponse().setStatusCode(HttpStatus.OK);
            return currentExchange.getResponse().setComplete();
        };

        filter.filter(exchange, chain).block();

        String requestId = exchange.getResponse().getHeaders().getFirst(LogContextConstants.REQUEST_ID_HEADER);
        assertThat(requestId).isNotBlank();
        assertThat(forwardedExchange.get()).isNotNull();
        assertThat(forwardedExchange.get().getRequest().getHeaders().getFirst(LogContextConstants.REQUEST_ID_HEADER))
                .isEqualTo(requestId);
    }

    @Test
    void shouldEchoIncomingRequestIdToDownstreamAndResponse() {
        MockServerWebExchange exchange = MockServerWebExchange.from(
                MockServerHttpRequest.get("/api/test")
                        .header(LogContextConstants.REQUEST_ID_HEADER, "req-123")
                        .build());
        AtomicReference<ServerWebExchange> forwardedExchange = new AtomicReference<>();
        GatewayFilterChain chain = currentExchange -> {
            forwardedExchange.set(currentExchange);
            currentExchange.getResponse().setStatusCode(HttpStatus.OK);
            return currentExchange.getResponse().setComplete();
        };

        filter.filter(exchange, chain).block();

        assertThat(exchange.getResponse().getHeaders().getFirst(LogContextConstants.REQUEST_ID_HEADER))
                .isEqualTo("req-123");
        assertThat(forwardedExchange.get()).isNotNull();
        assertThat(forwardedExchange.get().getRequest().getHeaders().getFirst(LogContextConstants.REQUEST_ID_HEADER))
                .isEqualTo("req-123");
    }

    @Test
    void shouldKeepSingleRequestIdHeaderWhenDownstreamAlsoReturnsIt() {
        MockServerWebExchange exchange = MockServerWebExchange.from(
                MockServerHttpRequest.get("/api/test")
                        .header(LogContextConstants.REQUEST_ID_HEADER, "req-123")
                        .build());
        GatewayFilterChain chain = currentExchange -> {
            currentExchange.getResponse().getHeaders().add(LogContextConstants.REQUEST_ID_HEADER, "req-123");
            currentExchange.getResponse().setStatusCode(HttpStatus.OK);
            return currentExchange.getResponse().setComplete();
        };

        filter.filter(exchange, chain).block();

        assertThat(exchange.getResponse().getHeaders().get(LogContextConstants.REQUEST_ID_HEADER))
                .containsExactly("req-123");
    }
}
