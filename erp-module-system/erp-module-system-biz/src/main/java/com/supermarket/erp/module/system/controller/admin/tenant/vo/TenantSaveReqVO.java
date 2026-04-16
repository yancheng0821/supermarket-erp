package com.supermarket.erp.module.system.controller.admin.tenant.vo;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TenantSaveReqVO {

    @NotBlank(message = "Tenant code must not be blank")
    private String code;

    @NotBlank(message = "Tenant name must not be blank")
    private String name;

    private String contactName;

    private String contactPhone;

    @NotNull(message = "Tenant status must not be null")
    @Min(value = 0, message = "Tenant status must be 0 or 1")
    @Max(value = 1, message = "Tenant status must be 0 or 1")
    private Integer status;

    private LocalDateTime expireDate;
}
