package com.supermarket.erp.framework.security.core;

import com.supermarket.erp.framework.security.config.SecurityProperties;
import com.supermarket.erp.framework.security.util.SecurityFrameworkUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.List;

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
                loginUser.setUserType(claims.get("userType", Integer.class));
                loginUser.setTenantId(claims.get("tenantId", Long.class));
                @SuppressWarnings("unchecked")
                List<String> permissionsList = claims.get("permissions", List.class);
                if (permissionsList != null) {
                    loginUser.setPermissions(new HashSet<>(permissionsList));
                }

                SecurityFrameworkUtils.setLoginUser(loginUser);
            } catch (Exception ignored) {
                // Invalid token — proceed without authentication
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
}
