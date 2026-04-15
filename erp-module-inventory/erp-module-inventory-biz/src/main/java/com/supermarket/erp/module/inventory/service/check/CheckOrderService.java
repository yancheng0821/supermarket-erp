package com.supermarket.erp.module.inventory.service.check;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.inventory.dal.dataobject.CheckOrderDO;
import com.supermarket.erp.module.inventory.dal.dataobject.CheckOrderItemDO;
import com.supermarket.erp.module.inventory.dal.dataobject.StockDO;
import com.supermarket.erp.module.inventory.dal.mysql.CheckOrderMapper;
import com.supermarket.erp.module.inventory.dal.mysql.CheckOrderItemMapper;
import com.supermarket.erp.module.inventory.service.stock.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CheckOrderService {

    private static final ErrorCode ORDER_NOT_FOUND = new ErrorCode(200401, "Check order not found");

    private final CheckOrderMapper checkOrderMapper;
    private final CheckOrderItemMapper checkOrderItemMapper;
    private final StockService stockService;

    private String generateOrderNo() {
        return "CHK" + System.currentTimeMillis();
    }

    public Long createOrder(CheckOrderDO order) {
        order.setOrderNo(generateOrderNo());
        order.setStatus(0);
        checkOrderMapper.insert(order);
        return order.getId();
    }

    public void addItem(CheckOrderItemDO item) {
        // Look up current stock to set systemQuantity
        CheckOrderDO order = checkOrderMapper.selectById(item.getOrderId());
        if (order == null) {
            throw new ServiceException(ORDER_NOT_FOUND);
        }
        StockDO stock = stockService.getOrCreateStock(item.getProductId(), order.getLocationType(), order.getLocationId());
        item.setSystemQuantity(stock.getQuantity());
        checkOrderItemMapper.insert(item);
    }

    public CheckOrderDO getOrder(Long id) {
        return checkOrderMapper.selectById(id);
    }

    public List<CheckOrderItemDO> getItems(Long orderId) {
        LambdaQueryWrapper<CheckOrderItemDO> query = new LambdaQueryWrapper<CheckOrderItemDO>()
                .eq(CheckOrderItemDO::getOrderId, orderId);
        return checkOrderItemMapper.selectList(query);
    }

    @Transactional
    public void confirmOrder(Long id) {
        CheckOrderDO order = checkOrderMapper.selectById(id);
        if (order == null) {
            throw new ServiceException(ORDER_NOT_FOUND);
        }
        if (order.getStatus() != 0) {
            return;
        }
        order.setStatus(2);
        checkOrderMapper.updateById(order);

        List<CheckOrderItemDO> items = getItems(id);
        for (CheckOrderItemDO item : items) {
            BigDecimal diff = item.getActualQuantity().subtract(item.getSystemQuantity());
            item.setDiffQuantity(diff);
            checkOrderItemMapper.updateById(item);

            if (diff.compareTo(BigDecimal.ZERO) > 0) {
                // Check profit: actual > system
                stockService.increaseStock(item.getProductId(), order.getLocationType(), order.getLocationId(),
                        diff, null, 5 /* check_profit */, order.getId());
            } else if (diff.compareTo(BigDecimal.ZERO) < 0) {
                // Check loss: actual < system
                stockService.decreaseStock(item.getProductId(), order.getLocationType(), order.getLocationId(),
                        diff.abs(), 6 /* check_loss */, order.getId());
            }
        }
    }

    public PageResult<CheckOrderDO> getOrderPage(PageParam pageParam, Integer status) {
        LambdaQueryWrapper<CheckOrderDO> query = new LambdaQueryWrapper<CheckOrderDO>()
                .eq(status != null, CheckOrderDO::getStatus, status)
                .orderByDesc(CheckOrderDO::getId);
        return checkOrderMapper.selectPage(pageParam, query);
    }
}
