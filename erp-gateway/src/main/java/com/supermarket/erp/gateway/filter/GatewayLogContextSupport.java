package com.supermarket.erp.gateway.filter;

import com.supermarket.erp.common.logging.LogContextConstants;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;

import java.util.UUID;

@Component
public class GatewayLogContextSupport {

    public void initialize(ServerWebExchange exchange) {
        String method = exchange.getRequest().getMethod() != null ? exchange.getRequest().getMethod().name() : "";
        exchange.getAttributes().putIfAbsent(LogContextConstants.METHOD, method);
        exchange.getAttributes().putIfAbsent(LogContextConstants.PATH, exchange.getRequest().getURI().getPath());

        Object current = exchange.getAttributes().get(LogContextConstants.REQUEST_ID);
        if (current instanceof String currentRequestId && StringUtils.hasText(currentRequestId)) {
            return;
        }

        String requestId = exchange.getRequest().getHeaders().getFirst(LogContextConstants.REQUEST_ID_HEADER);
        if (!StringUtils.hasText(requestId)) {
            requestId = UUID.randomUUID().toString();
        }
        exchange.getAttributes().put(LogContextConstants.REQUEST_ID, requestId);
    }

    public String getRequestId(ServerWebExchange exchange) {
        initialize(exchange);
        return (String) exchange.getAttributes().get(LogContextConstants.REQUEST_ID);
    }

    public void withMdc(ServerWebExchange exchange, Runnable runnable) {
        String previousRequestId = MDC.get(LogContextConstants.REQUEST_ID);
        String previousMethod = MDC.get(LogContextConstants.METHOD);
        String previousPath = MDC.get(LogContextConstants.PATH);

        try {
            putOrRemove(LogContextConstants.REQUEST_ID, getRequestId(exchange));
            putOrRemove(LogContextConstants.METHOD, (String) exchange.getAttributes().get(LogContextConstants.METHOD));
            putOrRemove(LogContextConstants.PATH, (String) exchange.getAttributes().get(LogContextConstants.PATH));
            runnable.run();
        } finally {
            putOrRemove(LogContextConstants.REQUEST_ID, previousRequestId);
            putOrRemove(LogContextConstants.METHOD, previousMethod);
            putOrRemove(LogContextConstants.PATH, previousPath);
        }
    }

    private void putOrRemove(String key, String value) {
        if (StringUtils.hasText(value)) {
            MDC.put(key, value);
            return;
        }
        MDC.remove(key);
    }
}
