package com.supermarket.erp.module.system.controller.admin.auth.vo;

import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class AuthSessionRespVO {

    private String loginScope;
    private UserInfo user;
    private TenantInfo tenant;
    private Set<String> permissions;
    private List<AuthMenuRespVO> menus;

    @Data
    public static class UserInfo {
        private Long userId;
        private String username;
        private String nickname;
    }

    @Data
    public static class TenantInfo {
        private Long tenantId;
        private String tenantCode;
        private String tenantName;
    }
}
