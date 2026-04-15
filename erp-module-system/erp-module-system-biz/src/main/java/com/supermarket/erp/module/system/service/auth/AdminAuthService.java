package com.supermarket.erp.module.system.service.auth;

import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.framework.security.config.SecurityProperties;
import com.supermarket.erp.module.system.dal.dataobject.AdminUserDO;
import com.supermarket.erp.module.system.dal.mysql.AdminUserMapper;
import com.supermarket.erp.module.system.service.permission.PermissionService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private static final ErrorCode AUTH_LOGIN_BAD_CREDENTIALS = new ErrorCode(1001, "Invalid username or password");
    private static final ErrorCode AUTH_LOGIN_USER_DISABLED = new ErrorCode(1002, "User account is disabled");

    private final AdminUserMapper adminUserMapper;
    private final PasswordEncoder passwordEncoder;
    private final SecurityProperties securityProperties;
    private final PermissionService permissionService;

    public Map<String, Object> login(String username, String password) {
        // 1. Find user by username
        AdminUserDO user = adminUserMapper.selectByUsername(username);
        if (user == null) {
            throw new ServiceException(AUTH_LOGIN_BAD_CREDENTIALS);
        }

        // 2. Verify password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ServiceException(AUTH_LOGIN_BAD_CREDENTIALS);
        }

        // 3. Check user status (0 = enabled)
        if (user.getStatus() != 0) {
            throw new ServiceException(AUTH_LOGIN_USER_DISABLED);
        }

        // 4. Get permissions
        Set<String> permissions = permissionService.getPermissionsByUserId(user.getId());

        // 5. Generate JWT token
        String token = generateToken(user, permissions);

        // 6. Build response
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("userId", user.getId());
        result.put("nickname", user.getNickname());
        return result;
    }

    private String generateToken(AdminUserDO user, Set<String> permissions) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + securityProperties.getJwtExpireSeconds() * 1000L);

        return Jwts.builder()
                .claim("userId", user.getId())
                .claim("userType", 1)
                .claim("tenantId", user.getTenantId())
                .claim("permissions", permissions)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(Keys.hmacShaKeyFor(securityProperties.getJwtSecret().getBytes(StandardCharsets.UTF_8)))
                .compact();
    }
}
