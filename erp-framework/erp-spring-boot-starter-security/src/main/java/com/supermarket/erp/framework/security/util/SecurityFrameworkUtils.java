package com.supermarket.erp.framework.security.util;

import com.supermarket.erp.framework.security.core.LoginUser;
import com.supermarket.erp.framework.security.core.LoginScope;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;

public class SecurityFrameworkUtils {

    /**
     * Get the current login user from SecurityContext.
     */
    public static LoginUser getLoginUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return null;
        }
        if (!(authentication.getPrincipal() instanceof LoginUser)) {
            return null;
        }
        return (LoginUser) authentication.getPrincipal();
    }

    /**
     * Get the current login user's ID.
     */
    public static Long getLoginUserId() {
        LoginUser loginUser = getLoginUser();
        return loginUser != null ? loginUser.getUserId() : null;
    }

    public static LoginScope getLoginScope() {
        LoginUser loginUser = getLoginUser();
        return loginUser != null ? loginUser.getLoginScope() : null;
    }

    public static boolean isPlatformLogin() {
        return LoginScope.PLATFORM.equals(getLoginScope());
    }

    public static boolean isTenantLogin() {
        return LoginScope.TENANT.equals(getLoginScope());
    }

    public static void requirePlatformScope() {
        if (!isPlatformLogin()) {
            throw new IllegalStateException("Current login scope is not platform");
        }
    }

    public static void requireTenantScope() {
        if (!isTenantLogin()) {
            throw new IllegalStateException("Current login scope is not tenant");
        }
    }

    public static void requirePermission(String permission) {
        LoginUser loginUser = getLoginUser();
        if (loginUser == null || loginUser.getPermissions() == null
                || !loginUser.getPermissions().contains(permission)) {
            throw new IllegalStateException("Current login user does not have permission: " + permission);
        }
    }

    public static void clearLoginUser() {
        SecurityContextHolder.clearContext();
    }

    /**
     * Set the login user into SecurityContext.
     */
    public static void setLoginUser(LoginUser loginUser) {
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(loginUser, null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
