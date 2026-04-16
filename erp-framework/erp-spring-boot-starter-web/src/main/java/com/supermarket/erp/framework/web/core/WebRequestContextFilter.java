package com.supermarket.erp.framework.web.core;

import com.supermarket.erp.common.logging.LogContextConstants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Slf4j
public class WebRequestContextFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestId = resolveRequestId(request);
        long startedAt = System.currentTimeMillis();

        try {
            MDC.put(LogContextConstants.REQUEST_ID, requestId);
            MDC.put(LogContextConstants.METHOD, request.getMethod());
            MDC.put(LogContextConstants.PATH, request.getRequestURI());
            response.setHeader(LogContextConstants.REQUEST_ID_HEADER, requestId);

            log.info("request started");
            filterChain.doFilter(request, response);
        } finally {
            log.info("request completed status={} durationMs={}", response.getStatus(),
                    System.currentTimeMillis() - startedAt);
            MDC.clear();
        }
    }

    private String resolveRequestId(HttpServletRequest request) {
        String requestId = request.getHeader(LogContextConstants.REQUEST_ID_HEADER);
        if (StringUtils.hasText(requestId)) {
            return requestId;
        }
        return UUID.randomUUID().toString();
    }
}
