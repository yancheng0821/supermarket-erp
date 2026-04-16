package com.supermarket.erp.framework.security.core;

import com.supermarket.erp.common.logging.LogContextConstants;
import com.supermarket.erp.framework.security.config.SecurityProperties;
import com.supermarket.erp.framework.security.util.SecurityFrameworkUtils;
import com.supermarket.erp.framework.tenant.core.TenantContextHolder;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private final SecurityProperties securityProperties;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = resolveToken(request);
        if (token != null) {
            try {
                Claims claims = Jwts.parser()
                        .verifyWith(Keys.hmacShaKeyFor(securityProperties.getJwtSecret().getBytes(StandardCharsets.UTF_8)))
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                LoginUser loginUser = new LoginUser();
                loginUser.setUserId(claims.get("userId", Long.class));
                String loginScope = claims.get("loginScope", String.class);
                if (loginScope != null) {
                    loginUser.setLoginScope(LoginScope.of(loginScope));
                }
                loginUser.setUserType(claims.get("userType", Integer.class));
                loginUser.setTenantId(claims.get("tenantId", Long.class));
                @SuppressWarnings("unchecked")
                List<String> permissionsList = claims.get("permissions", List.class);
                if (permissionsList != null) {
                    loginUser.setPermissions(new HashSet<>(permissionsList));
                }

                if (loginUser.getTenantId() != null) {
                    TenantContextHolder.setTenantId(loginUser.getTenantId());
                    MDC.put(LogContextConstants.TENANT_ID, String.valueOf(loginUser.getTenantId()));
                }
                if (loginUser.getUserId() != null) {
                    MDC.put(LogContextConstants.USER_ID, String.valueOf(loginUser.getUserId()));
                }
                SecurityFrameworkUtils.setLoginUser(loginUser);
            } catch (Exception ex) {
                log.warn("invalid bearer token requestId={} method={} path={} detail={}",
                        resolveRequestId(request),
                        request.getMethod(),
                        request.getRequestURI(),
                        ex.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private String resolveRequestId(HttpServletRequest request) {
        String requestId = MDC.get(LogContextConstants.REQUEST_ID);
        if (requestId != null) {
            return requestId;
        }
        return request.getHeader(LogContextConstants.REQUEST_ID_HEADER);
    }
}
