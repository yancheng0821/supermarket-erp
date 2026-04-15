package com.supermarket.erp.module.inventory.service.receipt;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.inventory.dal.dataobject.ReceiptOrderDO;
import com.supermarket.erp.module.inventory.dal.dataobject.ReceiptOrderItemDO;
import com.supermarket.erp.module.inventory.dal.mysql.ReceiptOrderMapper;
import com.supermarket.erp.module.inventory.dal.mysql.ReceiptOrderItemMapper;
import com.supermarket.erp.module.inventory.service.stock.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceiptOrderService {

    private static final ErrorCode ORDER_NOT_FOUND = new ErrorCode(200101, "Receipt order not found");

    private final ReceiptOrderMapper receiptOrderMapper;
    private final ReceiptOrderItemMapper receiptOrderItemMapper;
    private final StockService stockService;

    private String generateOrderNo() {
        return "REC" + System.currentTimeMillis();
    }

    public Long createOrder(ReceiptOrderDO order) {
        order.setOrderNo(generateOrderNo());
        order.setStatus(0);
        receiptOrderMapper.insert(order);
        return order.getId();
    }

    public void addItem(ReceiptOrderItemDO item) {
        receiptOrderItemMapper.insert(item);
    }

    public ReceiptOrderDO getOrder(Long id) {
        return receiptOrderMapper.selectById(id);
    }

    public List<ReceiptOrderItemDO> getItems(Long orderId) {
        LambdaQueryWrapper<ReceiptOrderItemDO> query = new LambdaQueryWrapper<ReceiptOrderItemDO>()
                .eq(ReceiptOrderItemDO::getOrderId, orderId);
        return receiptOrderItemMapper.selectList(query);
    }

    @Transactional
    public void confirmOrder(Long id) {
        ReceiptOrderDO order = receiptOrderMapper.selectById(id);
        if (order == null) {
            throw new ServiceException(ORDER_NOT_FOUND);
        }
        if (order.getStatus() != 0) {
            return;
        }
        order.setStatus(1);
        receiptOrderMapper.updateById(order);

        List<ReceiptOrderItemDO> items = getItems(id);
        for (ReceiptOrderItemDO item : items) {
            stockService.increaseStock(item.getProductId(), order.getLocationType(), order.getLocationId(),
                    item.getQuantity(), item.getCostPrice(), 1 /* receipt */, order.getId());
        }
    }

    public PageResult<ReceiptOrderDO> getOrderPage(PageParam pageParam, Integer type, Integer status) {
        LambdaQueryWrapper<ReceiptOrderDO> query = new LambdaQueryWrapper<ReceiptOrderDO>()
                .eq(type != null, ReceiptOrderDO::getType, type)
                .eq(status != null, ReceiptOrderDO::getStatus, status)
                .orderByDesc(ReceiptOrderDO::getId);
        return receiptOrderMapper.selectPage(pageParam, query);
    }
}
