package com.supermarket.erp.framework.tenant.web;

import com.supermarket.erp.framework.tenant.core.TenantContextHolder;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;

/**
 * Servlet filter that extracts tenant-id from request header and sets it in TenantContextHolder.
 */
public class TenantContextWebFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            String tenantIdHeader = httpRequest.getHeader("tenant-id");
            if (tenantIdHeader != null && !tenantIdHeader.isEmpty()) {
                TenantContextHolder.setTenantId(Long.parseLong(tenantIdHeader));
            }
            chain.doFilter(request, response);
        } finally {
            TenantContextHolder.clear();
        }
    }
}
