package com.supermarket.erp.module.system.controller.admin.user.vo;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class UserAssignRolesReqVO {

    @NotNull(message = "Role IDs must not be null")
    private List<Long> roleIds;
}
