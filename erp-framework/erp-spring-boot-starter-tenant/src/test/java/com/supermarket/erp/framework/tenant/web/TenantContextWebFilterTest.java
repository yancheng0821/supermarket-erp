package com.supermarket.erp.framework.tenant.web;

import com.supermarket.erp.common.logging.LogContextConstants;
import com.supermarket.erp.framework.tenant.core.TenantContextHolder;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.MDC;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;

class TenantContextWebFilterTest {

    private TenantContextWebFilter filter;

    @BeforeEach
    void setUp() {
        filter = new TenantContextWebFilter();
        TenantContextHolder.clear();
        MDC.clear();
    }

    @AfterEach
    void tearDown() {
        TenantContextHolder.clear();
        MDC.clear();
    }

    @Test
    void shouldUseExistingTenantContextBeforeHeaderFallback() throws Exception {
        TenantContextHolder.setTenantId(99L);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("tenant-id", "123");
        AtomicReference<Long> tenantIdRef = new AtomicReference<>();
        AtomicReference<String> mdcTenantIdRef = new AtomicReference<>();

        filter.doFilter(request, new MockHttpServletResponse(), (req, res) -> {
            tenantIdRef.set(TenantContextHolder.getTenantId());
            mdcTenantIdRef.set(MDC.get(LogContextConstants.TENANT_ID));
        });

        assertThat(tenantIdRef.get()).isEqualTo(99L);
        assertThat(mdcTenantIdRef.get()).isEqualTo("99");
        assertThat(TenantContextHolder.getTenantId()).isNull();
    }

    @Test
    void shouldUseTenantHeaderWhenContextMissing() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("tenant-id", "123");
        AtomicReference<Long> tenantIdRef = new AtomicReference<>();
        AtomicReference<String> mdcTenantIdRef = new AtomicReference<>();

        filter.doFilter(request, new MockHttpServletResponse(), (req, res) -> {
            tenantIdRef.set(TenantContextHolder.getTenantId());
            mdcTenantIdRef.set(MDC.get(LogContextConstants.TENANT_ID));
        });

        assertThat(tenantIdRef.get()).isEqualTo(123L);
        assertThat(mdcTenantIdRef.get()).isEqualTo("123");
        assertThat(TenantContextHolder.getTenantId()).isNull();
    }

    @Test
    void shouldIgnoreMalformedTenantHeader() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("tenant-id", "oops");
        AtomicReference<Long> tenantIdRef = new AtomicReference<>();
        AtomicReference<String> mdcTenantIdRef = new AtomicReference<>();

        filter.doFilter(request, new MockHttpServletResponse(), (req, res) -> {
            tenantIdRef.set(TenantContextHolder.getTenantId());
            mdcTenantIdRef.set(MDC.get(LogContextConstants.TENANT_ID));
        });

        assertThat(tenantIdRef.get()).isNull();
        assertThat(mdcTenantIdRef.get()).isNull();
        assertThat(TenantContextHolder.getTenantId()).isNull();
    }
}
