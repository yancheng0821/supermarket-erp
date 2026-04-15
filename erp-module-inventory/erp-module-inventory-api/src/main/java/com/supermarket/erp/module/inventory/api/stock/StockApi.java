package com.supermarket.erp.module.inventory.api.stock;

import com.supermarket.erp.module.inventory.api.stock.dto.StockDTO;

import java.math.BigDecimal;

public interface StockApi {

    StockDTO getStock(Long productId, Integer locationType, Long locationId);

    void increaseStock(Long productId, Integer locationType, Long locationId, BigDecimal quantity);

    void decreaseStock(Long productId, Integer locationType, Long locationId, BigDecimal quantity);
}
