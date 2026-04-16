package com.supermarket.erp.module.system.controller.admin.user.vo;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserSaveReqVO {

    @NotBlank(message = "Username must not be blank")
    private String username;

    private String password;

    @NotBlank(message = "Nickname must not be blank")
    private String nickname;

    private String phone;

    private String email;

    private String avatar;

    @NotNull(message = "User status must not be null")
    @Min(value = 0, message = "User status must be 0 or 1")
    @Max(value = 1, message = "User status must be 0 or 1")
    private Integer status;
}
