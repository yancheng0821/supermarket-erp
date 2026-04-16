package com.supermarket.erp.framework.tenant.web;

import com.supermarket.erp.common.logging.LogContextConstants;
import com.supermarket.erp.framework.tenant.core.TenantContextHolder;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;

import java.io.IOException;

/**
 * Servlet filter that extracts tenant-id from request header and sets it in TenantContextHolder.
 */
@Slf4j
public class TenantContextWebFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            Long tenantId = TenantContextHolder.getTenantId();
            if (tenantId == null) {
                String tenantIdHeader = httpRequest.getHeader("tenant-id");
                if (tenantIdHeader != null && !tenantIdHeader.isEmpty()) {
                    try {
                        tenantId = Long.parseLong(tenantIdHeader);
                        TenantContextHolder.setTenantId(tenantId);
                    } catch (NumberFormatException ex) {
                        log.warn("ignored malformed tenant header requestId={} method={} path={} tenantHeader={}",
                                resolveRequestId(httpRequest),
                                httpRequest.getMethod(),
                                httpRequest.getRequestURI(),
                                tenantIdHeader);
                    }
                }
            }
            if (tenantId != null) {
                MDC.put(LogContextConstants.TENANT_ID, String.valueOf(tenantId));
            }
            chain.doFilter(request, response);
        } finally {
            TenantContextHolder.clear();
        }
    }

    private String resolveRequestId(HttpServletRequest request) {
        String requestId = MDC.get(LogContextConstants.REQUEST_ID);
        if (requestId != null) {
            return requestId;
        }
        return request.getHeader(LogContextConstants.REQUEST_ID_HEADER);
    }
}
