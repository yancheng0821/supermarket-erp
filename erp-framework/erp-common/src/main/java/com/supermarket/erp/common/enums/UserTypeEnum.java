package com.supermarket.erp.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum UserTypeEnum {

    ADMIN(1, "Admin"),
    MEMBER(2, "Member");

    private final Integer value;
    private final String name;
}
