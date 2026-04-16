package com.supermarket.erp.module.system.controller.admin.menu.vo;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MenuSaveReqVO {

    @NotBlank(message = "Menu scope must not be blank")
    private String scope;

    @NotBlank(message = "Menu name must not be blank")
    private String name;

    private String permission;

    @NotNull(message = "Menu type must not be null")
    @Min(value = 1, message = "Menu type must be between 1 and 3")
    @Max(value = 3, message = "Menu type must be between 1 and 3")
    private Integer type;

    @NotNull(message = "Parent ID must not be null")
    private Long parentId;

    private String path;

    private String component;

    private String icon;

    @NotNull(message = "Sort must not be null")
    private Integer sort;

    @NotNull(message = "Menu status must not be null")
    @Min(value = 0, message = "Menu status must be 0 or 1")
    @Max(value = 1, message = "Menu status must be 0 or 1")
    private Integer status;
}
