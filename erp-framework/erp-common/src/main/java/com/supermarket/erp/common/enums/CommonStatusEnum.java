package com.supermarket.erp.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CommonStatusEnum {

    ENABLE(0, "Enabled"),
    DISABLE(1, "Disabled");

    private final Integer status;
    private final String name;
}
