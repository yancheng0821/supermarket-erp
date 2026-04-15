package com.supermarket.erp.module.member.api.member.dto;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class MemberDTO implements Serializable {

    private Long id;
    private Long tenantId;
    private String phone;
    private String name;
    private String nickname;
    private Integer level;
    private Integer points;
    private BigDecimal balance;
    private Integer status;
}
