package com.supermarket.erp.module.system.controller.admin.role.vo;

import lombok.Data;

@Data
public class RolePageRespVO {

    private Long id;
    private String name;
    private String code;
    private Integer sort;
    private Integer status;
    private String remark;
}
