package com.supermarket.erp.module.system.service.auth;

import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.framework.security.config.SecurityProperties;
import com.supermarket.erp.framework.security.core.LoginUser;
import com.supermarket.erp.framework.security.core.LoginScope;
import com.supermarket.erp.framework.tenant.core.TenantContextHolder;
import com.supermarket.erp.module.system.controller.admin.auth.vo.AuthSessionRespVO;
import com.supermarket.erp.module.system.dal.dataobject.AdminUserDO;
import com.supermarket.erp.module.system.dal.dataobject.PlatformUserDO;
import com.supermarket.erp.module.system.dal.dataobject.TenantDO;
import com.supermarket.erp.module.system.dal.mysql.AdminUserMapper;
import com.supermarket.erp.module.system.dal.mysql.PlatformUserMapper;
import com.supermarket.erp.module.system.dal.mysql.TenantMapper;
import com.supermarket.erp.module.system.service.menu.AdminMenuTreeService;
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
    private static final ErrorCode AUTH_LOGIN_TENANT_DISABLED = new ErrorCode(1003, "Tenant is disabled");
    private static final ErrorCode AUTH_LOGIN_REQUIRED = new ErrorCode(1004, "Login required");

    private final PlatformUserMapper platformUserMapper;
    private final TenantMapper tenantMapper;
    private final AdminUserMapper adminUserMapper;
    private final PasswordEncoder passwordEncoder;
    private final SecurityProperties securityProperties;
    private final PermissionService permissionService;
    private final AdminMenuTreeService adminMenuTreeService;

    public Map<String, Object> login(String username, String password) {
        PlatformUserDO platformUser = platformUserMapper.selectByUsername(username);
        if (platformUser != null) {
            return platformLogin(username, password);
        }

        AdminUserDO user = adminUserMapper.selectByUsername(username);
        if (user == null || user.getTenantId() == null) {
            throw new ServiceException(AUTH_LOGIN_BAD_CREDENTIALS);
        }
        return tenantLoginByTenantId(user.getTenantId(), username, password);
    }

    public Map<String, Object> platformLogin(String username, String password) {
        PlatformUserDO user = platformUserMapper.selectByUsername(username);
        if (user == null) {
            throw new ServiceException(AUTH_LOGIN_BAD_CREDENTIALS);
        }
        validatePassword(password, user.getPassword());
        validateStatus(user.getStatus());
        Set<String> permissions = permissionService.getPlatformPermissions();
        String token = generateToken(user.getId(), null, LoginScope.PLATFORM, permissions);
        return buildResult(token, user.getId(), user.getNickname(), LoginScope.PLATFORM);
    }

    public Map<String, Object> tenantLogin(String tenantCode, String username, String password) {
        TenantDO tenant = tenantMapper.selectByCode(tenantCode);
        if (tenant == null) {
            throw new ServiceException(AUTH_LOGIN_BAD_CREDENTIALS);
        }
        if (tenant.getStatus() != null && tenant.getStatus() != 0) {
            throw new ServiceException(AUTH_LOGIN_TENANT_DISABLED);
        }
        return tenantLoginByTenantId(tenant.getId(), username, password);
    }

    public AuthSessionRespVO getSession(LoginUser loginUser) {
        if (loginUser == null || loginUser.getLoginScope() == null) {
            throw new ServiceException(AUTH_LOGIN_REQUIRED);
        }
        if (loginUser.getLoginScope() == LoginScope.PLATFORM) {
            return buildPlatformSession(loginUser);
        }
        return buildTenantSession(loginUser);
    }

    private Map<String, Object> tenantLoginByTenantId(Long tenantId, String username, String password) {
        try {
            TenantContextHolder.setTenantId(tenantId);
            AdminUserDO user = adminUserMapper.selectByTenantIdAndUsername(tenantId, username);
            if (user == null) {
                throw new ServiceException(AUTH_LOGIN_BAD_CREDENTIALS);
            }
            validatePassword(password, user.getPassword());
            validateStatus(user.getStatus());
            Set<String> permissions = permissionService.getPermissionsByUserId(user.getId());
            String token = generateToken(user.getId(), tenantId, LoginScope.TENANT, permissions);
            return buildResult(token, user.getId(), user.getNickname(), LoginScope.TENANT);
        } finally {
            TenantContextHolder.clear();
        }
    }

    private void validatePassword(String password, String encodedPassword) {
        if (!passwordEncoder.matches(password, encodedPassword)) {
            throw new ServiceException(AUTH_LOGIN_BAD_CREDENTIALS);
        }
    }

    private void validateStatus(Integer status) {
        if (status != null && status != 0) {
            throw new ServiceException(AUTH_LOGIN_USER_DISABLED);
        }
    }

    private Map<String, Object> buildResult(String token, Long userId, String nickname, LoginScope loginScope) {
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("userId", userId);
        result.put("nickname", nickname);
        result.put("loginScope", loginScope.getCode());
        return result;
    }

    private AuthSessionRespVO buildPlatformSession(LoginUser loginUser) {
        PlatformUserDO user = platformUserMapper.selectById(loginUser.getUserId());
        if (user == null) {
            throw new ServiceException(AUTH_LOGIN_REQUIRED);
        }

        AuthSessionRespVO session = new AuthSessionRespVO();
        session.setLoginScope(LoginScope.PLATFORM.getCode());
        session.setUser(buildUserInfo(user.getId(), user.getUsername(), user.getNickname()));
        session.setPermissions(loginUser.getPermissions());
        session.setMenus(adminMenuTreeService.getMenuTree(loginUser));
        return session;
    }

    private AuthSessionRespVO buildTenantSession(LoginUser loginUser) {
        try {
            TenantContextHolder.setTenantId(loginUser.getTenantId());
            AdminUserDO user = adminUserMapper.selectById(loginUser.getUserId());
            TenantDO tenant = tenantMapper.selectById(loginUser.getTenantId());
            if (user == null || tenant == null) {
                throw new ServiceException(AUTH_LOGIN_REQUIRED);
            }

            AuthSessionRespVO session = new AuthSessionRespVO();
            session.setLoginScope(LoginScope.TENANT.getCode());
            session.setUser(buildUserInfo(user.getId(), user.getUsername(), user.getNickname()));
            session.setTenant(buildTenantInfo(tenant));
            session.setPermissions(loginUser.getPermissions());
            session.setMenus(adminMenuTreeService.getMenuTree(loginUser));
            return session;
        } finally {
            TenantContextHolder.clear();
        }
    }

    private AuthSessionRespVO.UserInfo buildUserInfo(Long userId, String username, String nickname) {
        AuthSessionRespVO.UserInfo userInfo = new AuthSessionRespVO.UserInfo();
        userInfo.setUserId(userId);
        userInfo.setUsername(username);
        userInfo.setNickname(nickname);
        return userInfo;
    }

    private AuthSessionRespVO.TenantInfo buildTenantInfo(TenantDO tenant) {
        AuthSessionRespVO.TenantInfo tenantInfo = new AuthSessionRespVO.TenantInfo();
        tenantInfo.setTenantId(tenant.getId());
        tenantInfo.setTenantCode(tenant.getCode());
        tenantInfo.setTenantName(tenant.getName());
        return tenantInfo;
    }

    private String generateToken(Long userId, Long tenantId, LoginScope loginScope, Set<String> permissions) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + securityProperties.getJwtExpireSeconds() * 1000L);

        return Jwts.builder()
                .claim("userId", userId)
                .claim("userType", loginScope.getUserType())
                .claim("loginScope", loginScope.getCode())
                .claim("tenantId", tenantId)
                .claim("permissions", permissions)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(Keys.hmacShaKeyFor(securityProperties.getJwtSecret().getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

}
