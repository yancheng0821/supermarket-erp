package com.supermarket.erp.module.system.controller.admin.tenant.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TenantPageRespVO {

    private Long id;
    private String code;
    private String name;
    private String contactName;
    private String contactPhone;
    private Integer status;
    private LocalDateTime expireDate;
}
