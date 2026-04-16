package com.supermarket.erp.module.system.controller.admin.menu.vo;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class MenuTreeRespVO {

    private Long id;
    private String scope;
    private String name;
    private String permission;
    private Integer type;
    private Long parentId;
    private String path;
    private String component;
    private String icon;
    private Integer sort;
    private Integer status;
    private List<MenuTreeRespVO> children = new ArrayList<>();
}
