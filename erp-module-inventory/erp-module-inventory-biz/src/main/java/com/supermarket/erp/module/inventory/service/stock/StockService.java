package com.supermarket.erp.module.inventory.service.stock;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.inventory.dal.dataobject.StockDO;
import com.supermarket.erp.module.inventory.dal.dataobject.StockLogDO;
import com.supermarket.erp.module.inventory.dal.mysql.StockMapper;
import com.supermarket.erp.module.inventory.dal.mysql.StockLogMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class StockService {

    private static final ErrorCode STOCK_NOT_FOUND = new ErrorCode(200001, "Stock record not found");
    private static final ErrorCode STOCK_INSUFFICIENT = new ErrorCode(200002, "Insufficient stock");

    private final StockMapper stockMapper;
    private final StockLogMapper stockLogMapper;

    /**
     * Get or create stock record
     */
    public StockDO getOrCreateStock(Long productId, Integer locationType, Long locationId) {
        LambdaQueryWrapper<StockDO> query = new LambdaQueryWrapper<StockDO>()
                .eq(StockDO::getProductId, productId)
                .eq(StockDO::getLocationType, locationType)
                .eq(StockDO::getLocationId, locationId);
        StockDO stock = stockMapper.selectOne(query);
        if (stock == null) {
            stock = new StockDO();
            stock.setProductId(productId);
            stock.setLocationType(locationType);
            stock.setLocationId(locationId);
            stock.setQuantity(BigDecimal.ZERO);
            stock.setCostAmount(BigDecimal.ZERO);
            stockMapper.insert(stock);
        }
        return stock;
    }

    /**
     * Increase stock (for receipt, transfer-in, check-profit)
     */
    @Transactional
    public void increaseStock(Long productId, Integer locationType, Long locationId,
                              BigDecimal quantity, BigDecimal costPrice, Integer bizType, Long bizId) {
        StockDO stock = getOrCreateStock(productId, locationType, locationId);
        BigDecimal before = stock.getQuantity();
        BigDecimal after = before.add(quantity);
        stock.setQuantity(after);
        if (costPrice != null) {
            stock.setCostAmount(stock.getCostAmount().add(costPrice.multiply(quantity)));
        }
        stockMapper.updateById(stock);

        // Append stock log
        StockLogDO log = new StockLogDO();
        log.setProductId(productId);
        log.setLocationType(locationType);
        log.setLocationId(locationId);
        log.setBizType(bizType);
        log.setBizId(bizId);
        log.setQuantityChange(quantity);
        log.setQuantityBefore(before);
        log.setQuantityAfter(after);
        stockLogMapper.insert(log);
    }

    /**
     * Decrease stock (for issue, transfer-out, check-loss)
     */
    @Transactional
    public void decreaseStock(Long productId, Integer locationType, Long locationId,
                              BigDecimal quantity, Integer bizType, Long bizId) {
        StockDO stock = getOrCreateStock(productId, locationType, locationId);
        BigDecimal before = stock.getQuantity();
        if (before.compareTo(quantity) < 0) {
            throw new ServiceException(STOCK_INSUFFICIENT);
        }
        BigDecimal after = before.subtract(quantity);
        stock.setQuantity(after);
        stockMapper.updateById(stock);

        StockLogDO log = new StockLogDO();
        log.setProductId(productId);
        log.setLocationType(locationType);
        log.setLocationId(locationId);
        log.setBizType(bizType);
        log.setBizId(bizId);
        log.setQuantityChange(quantity.negate());
        log.setQuantityBefore(before);
        log.setQuantityAfter(after);
        stockLogMapper.insert(log);
    }

    /**
     * Paginated stock query
     */
    public PageResult<StockDO> getStockPage(PageParam pageParam, Long productId, Long locationId) {
        LambdaQueryWrapper<StockDO> query = new LambdaQueryWrapper<StockDO>()
                .eq(productId != null, StockDO::getProductId, productId)
                .eq(locationId != null, StockDO::getLocationId, locationId)
                .orderByDesc(StockDO::getId);
        return stockMapper.selectPage(pageParam, query);
    }
}
