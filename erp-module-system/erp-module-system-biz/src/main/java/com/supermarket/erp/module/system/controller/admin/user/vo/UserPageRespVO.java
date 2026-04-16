package com.supermarket.erp.module.system.controller.admin.user.vo;

import lombok.Data;

@Data
public class UserPageRespVO {

    private Long id;
    private String username;
    private String nickname;
    private String phone;
    private String email;
    private String avatar;
    private Integer status;
}
