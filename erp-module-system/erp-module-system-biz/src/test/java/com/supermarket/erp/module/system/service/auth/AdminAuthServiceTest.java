package com.supermarket.erp.module.system.service.auth;

import com.supermarket.erp.framework.security.config.SecurityProperties;
import com.supermarket.erp.module.system.dal.dataobject.AdminUserDO;
import com.supermarket.erp.module.system.dal.dataobject.PlatformUserDO;
import com.supermarket.erp.module.system.dal.dataobject.TenantDO;
import com.supermarket.erp.module.system.dal.mysql.AdminUserMapper;
import com.supermarket.erp.module.system.dal.mysql.PlatformUserMapper;
import com.supermarket.erp.module.system.dal.mysql.TenantMapper;
import com.supermarket.erp.module.system.service.permission.PermissionService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminAuthServiceTest {

    private static final String JWT_SECRET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789AB";

    @Mock
    private AdminUserMapper adminUserMapper;

    @Mock
    private PlatformUserMapper platformUserMapper;

    @Mock
    private TenantMapper tenantMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private SecurityProperties securityProperties;

    @Mock
    private PermissionService permissionService;

    @InjectMocks
    private AdminAuthService adminAuthService;

    @Test
    void platformLogin_shouldIssuePlatformScopedTokenWithoutTenantId() {
        PlatformUserDO user = new PlatformUserDO();
        user.setId(100L);
        user.setUsername("platform-admin");
        user.setPassword("encoded-password");
        user.setNickname("Platform Admin");
        user.setStatus(0);

        when(platformUserMapper.selectByUsername("platform-admin")).thenReturn(user);
        when(passwordEncoder.matches("admin123", "encoded-password")).thenReturn(true);
        when(permissionService.getPlatformPermissions()).thenReturn(Set.of(
                "platform:tenant:page",
                "platform:menu:tree"
        ));
        when(securityProperties.getJwtSecret()).thenReturn(JWT_SECRET);
        when(securityProperties.getJwtExpireSeconds()).thenReturn(3600);

        Map<String, Object> result = adminAuthService.platformLogin("platform-admin", "admin123");

        Claims claims = parseClaims((String) result.get("token"));
        assertThat(claims.get("loginScope", String.class)).isEqualTo("platform");
        assertThat(claims.get("userId", Long.class)).isEqualTo(100L);
        assertThat(claims.get("tenantId")).isNull();
        @SuppressWarnings("unchecked")
        List<String> permissions = (List<String>) claims.get("permissions");
        assertThat(permissions).contains("platform:tenant:page", "platform:menu:tree");
    }

    @Test
    void tenantLogin_shouldResolveTenantByCodeAndIssueTenantScopedToken() {
        TenantDO tenant = new TenantDO();
        tenant.setId(200L);
        tenant.setCode("freshmart-sh");
        tenant.setStatus(0);

        AdminUserDO user = new AdminUserDO();
        user.setId(300L);
        user.setTenantId(200L);
        user.setUsername("store-admin");
        user.setPassword("encoded-password");
        user.setNickname("Store Admin");
        user.setStatus(0);

        when(tenantMapper.selectByCode("freshmart-sh")).thenReturn(tenant);
        when(adminUserMapper.selectByTenantIdAndUsername(200L, "store-admin")).thenReturn(user);
        when(passwordEncoder.matches("store123", "encoded-password")).thenReturn(true);
        when(permissionService.getPermissionsByUserId(300L)).thenReturn(Set.of(
                "system:user:create",
                "system:role:assign-menu"
        ));
        when(securityProperties.getJwtSecret()).thenReturn(JWT_SECRET);
        when(securityProperties.getJwtExpireSeconds()).thenReturn(3600);

        Map<String, Object> result = adminAuthService.tenantLogin("freshmart-sh", "store-admin", "store123");

        Claims claims = parseClaims((String) result.get("token"));
        assertThat(claims.get("loginScope", String.class)).isEqualTo("tenant");
        assertThat(claims.get("userId", Long.class)).isEqualTo(300L);
        assertThat(claims.get("tenantId", Long.class)).isEqualTo(200L);
        @SuppressWarnings("unchecked")
        List<String> permissions = (List<String>) claims.get("permissions");
        assertThat(permissions).contains("system:user:create", "system:role:assign-menu");
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
