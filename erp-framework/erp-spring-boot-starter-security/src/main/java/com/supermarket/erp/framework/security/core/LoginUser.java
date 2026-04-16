package com.supermarket.erp.framework.security.core;

import lombok.Data;

import java.util.Set;

@Data
public class LoginUser {

    private Long userId;

    private LoginScope loginScope;

    private Integer userType;

    private Long tenantId;

    private Set<String> permissions;
}
