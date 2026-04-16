package com.supermarket.erp.module.system.controller.admin.auth.vo;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PlatformLoginReqVO {

    @NotBlank(message = "Username must not be blank")
    private String username;

    @NotBlank(message = "Password must not be blank")
    private String password;
}
