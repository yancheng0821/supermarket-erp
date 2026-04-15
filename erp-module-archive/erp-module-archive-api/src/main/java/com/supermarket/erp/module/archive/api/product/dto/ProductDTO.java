package com.supermarket.erp.module.archive.api.product.dto;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class ProductDTO implements Serializable {

    private Long id;
    private Long tenantId;
    private String name;
    private String barcode;
    private Long categoryId;
    private String spec;
    private String unit;
    private BigDecimal retailPrice;
    private Integer status;
}
