package com.supermarket.erp.module.system.controller.admin.auth.vo;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TenantLoginReqVO {

    @NotBlank(message = "Tenant code must not be blank")
    private String tenantCode;

    @NotBlank(message = "Username must not be blank")
    private String username;

    @NotBlank(message = "Password must not be blank")
    private String password;
}
