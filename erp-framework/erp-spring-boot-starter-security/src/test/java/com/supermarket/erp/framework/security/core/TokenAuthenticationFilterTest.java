package com.supermarket.erp.framework.security.core;

import com.supermarket.erp.common.logging.LogContextConstants;
import com.supermarket.erp.framework.security.config.SecurityProperties;
import com.supermarket.erp.framework.security.util.SecurityFrameworkUtils;
import com.supermarket.erp.framework.tenant.core.TenantContextHolder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.MDC;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;

class TokenAuthenticationFilterTest {

    private static final String JWT_SECRET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789AB";

    private SecurityProperties securityProperties;
    private TokenAuthenticationFilter filter;

    @BeforeEach
    void setUp() {
        securityProperties = new SecurityProperties();
        securityProperties.setJwtSecret(JWT_SECRET);
        filter = new TokenAuthenticationFilter(securityProperties);
        SecurityFrameworkUtils.clearLoginUser();
        TenantContextHolder.clear();
        MDC.clear();
    }

    @AfterEach
    void tearDown() {
        SecurityFrameworkUtils.clearLoginUser();
        TenantContextHolder.clear();
        MDC.clear();
    }

    @Test
    void shouldPopulateSecurityTenantAndMdcContextFromValidToken() throws Exception {
        String token = Jwts.builder()
                .claim("userId", 10L)
                .claim("tenantId", 20L)
                .claim("userType", 1)
                .claim("loginScope", "TENANT")
                .claim("permissions", List.of("system:user:query"))
                .signWith(Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8)))
                .compact();

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer " + token);
        AtomicReference<LoginUser> loginUserRef = new AtomicReference<>();
        AtomicReference<Long> tenantIdRef = new AtomicReference<>();
        AtomicReference<String> mdcUserIdRef = new AtomicReference<>();
        AtomicReference<String> mdcTenantIdRef = new AtomicReference<>();

        filter.doFilter(request, new MockHttpServletResponse(), (req, res) -> {
            loginUserRef.set(SecurityFrameworkUtils.getLoginUser());
            tenantIdRef.set(TenantContextHolder.getTenantId());
            mdcUserIdRef.set(MDC.get(LogContextConstants.USER_ID));
            mdcTenantIdRef.set(MDC.get(LogContextConstants.TENANT_ID));
        });

        assertThat(loginUserRef.get()).isNotNull();
        assertThat(loginUserRef.get().getUserId()).isEqualTo(10L);
        assertThat(loginUserRef.get().getTenantId()).isEqualTo(20L);
        assertThat(loginUserRef.get().getLoginScope()).isEqualTo(LoginScope.TENANT);
        assertThat(tenantIdRef.get()).isEqualTo(20L);
        assertThat(mdcUserIdRef.get()).isEqualTo("10");
        assertThat(mdcTenantIdRef.get()).isEqualTo("20");
    }

    @Test
    void shouldIgnoreInvalidTokenWithoutPopulatingContext() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer invalid-token");
        AtomicReference<LoginUser> loginUserRef = new AtomicReference<>();
        AtomicReference<Long> tenantIdRef = new AtomicReference<>();
        AtomicReference<String> mdcUserIdRef = new AtomicReference<>();
        AtomicReference<String> mdcTenantIdRef = new AtomicReference<>();

        filter.doFilter(request, new MockHttpServletResponse(), (req, res) -> {
            loginUserRef.set(SecurityFrameworkUtils.getLoginUser());
            tenantIdRef.set(TenantContextHolder.getTenantId());
            mdcUserIdRef.set(MDC.get(LogContextConstants.USER_ID));
            mdcTenantIdRef.set(MDC.get(LogContextConstants.TENANT_ID));
        });

        assertThat(loginUserRef.get()).isNull();
        assertThat(tenantIdRef.get()).isNull();
        assertThat(mdcUserIdRef.get()).isNull();
        assertThat(mdcTenantIdRef.get()).isNull();
    }
}
