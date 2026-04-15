package com.supermarket.erp.module.purchase.api.order.dto;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class PurchaseOrderDTO implements Serializable {

    private Long id;
    private Long tenantId;
    private String orderNo;
    private Integer type;
    private Long supplierId;
    private BigDecimal totalAmount;
    private Integer status;
}
