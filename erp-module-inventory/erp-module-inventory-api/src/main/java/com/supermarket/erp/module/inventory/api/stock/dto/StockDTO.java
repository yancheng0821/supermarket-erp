package com.supermarket.erp.module.inventory.api.stock.dto;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class StockDTO implements Serializable {

    private Long id;
    private Long productId;
    private Integer locationType;
    private Long locationId;
    private BigDecimal quantity;
    private BigDecimal costAmount;
}
