package com.supermarket.erp.module.finance.api.settlement.dto;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class SupplierSettlementDTO implements Serializable {

    private Long id;
    private Long tenantId;
    private String settlementNo;
    private Long supplierId;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private Integer status;
}
