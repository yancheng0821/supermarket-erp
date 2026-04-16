package com.supermarket.erp.module.system.controller.admin.user.vo;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserResetPasswordReqVO {

    @NotBlank(message = "Password must not be blank")
    private String password;
}
