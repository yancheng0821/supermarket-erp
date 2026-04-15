package com.supermarket.erp.module.operation.api.sales.dto;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class SalesOrderDTO implements Serializable {

    private Long id;
    private Long tenantId;
    private String orderNo;
    private Integer channel;
    private Long storeId;
    private Long memberId;
    private BigDecimal totalAmount;
    private BigDecimal payAmount;
    private Integer status;
}
