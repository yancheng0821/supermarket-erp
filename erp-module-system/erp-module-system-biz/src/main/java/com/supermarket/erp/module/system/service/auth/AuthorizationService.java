package com.supermarket.erp.module.system.service.auth;

import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.framework.security.core.LoginScope;
import com.supermarket.erp.framework.security.core.LoginUser;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {

    public void requirePlatformScope(LoginUser loginUser) {
        if (loginUser == null || loginUser.getLoginScope() != LoginScope.PLATFORM) {
            throw new ServiceException(403, "Forbidden");
        }
    }

    public void requireTenantScope(LoginUser loginUser) {
        if (loginUser == null || loginUser.getLoginScope() != LoginScope.TENANT) {
            throw new ServiceException(403, "Forbidden");
        }
    }

    public void requirePermission(LoginUser loginUser, String permission) {
        if (loginUser == null || loginUser.getPermissions() == null
                || !loginUser.getPermissions().contains(permission)) {
            throw new ServiceException(403, "Forbidden");
        }
    }
}
