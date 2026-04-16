package com.supermarket.erp.module.system.controller.admin.auth.vo;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class AuthMenuRespVO {

    private Long id;
    private String name;
    private String path;
    private String component;
    private String icon;
    private String permission;
    private List<AuthMenuRespVO> children = new ArrayList<>();
}
