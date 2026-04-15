package com.supermarket.erp.module.system.api.permission;

import java.util.Set;

public interface PermissionApi {

    Set<String> getPermissionsByUserId(Long userId);
}
