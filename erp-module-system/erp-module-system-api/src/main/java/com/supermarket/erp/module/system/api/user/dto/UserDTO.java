package com.supermarket.erp.module.system.api.user.dto;

import lombok.Data;

@Data
public class UserDTO {

    private Long id;
    private Long tenantId;
    private String username;
    private String nickname;
    private String phone;
    private Integer status;
}
