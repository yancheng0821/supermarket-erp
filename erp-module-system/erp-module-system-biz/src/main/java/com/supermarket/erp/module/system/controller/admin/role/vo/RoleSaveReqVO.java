package com.supermarket.erp.module.system.controller.admin.role.vo;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleSaveReqVO {

    @NotBlank(message = "Role name must not be blank")
    private String name;

    @NotBlank(message = "Role code must not be blank")
    private String code;

    @NotNull(message = "Role sort must not be null")
    private Integer sort;

    @NotNull(message = "Role status must not be null")
    @Min(value = 0, message = "Role status must be 0 or 1")
    @Max(value = 1, message = "Role status must be 0 or 1")
    private Integer status;

    private String remark;
}
