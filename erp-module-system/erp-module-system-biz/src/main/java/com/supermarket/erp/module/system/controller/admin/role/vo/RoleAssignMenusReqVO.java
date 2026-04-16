package com.supermarket.erp.module.system.controller.admin.role.vo;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class RoleAssignMenusReqVO {

    @NotNull(message = "Menu IDs must not be null")
    private List<Long> menuIds;
}
