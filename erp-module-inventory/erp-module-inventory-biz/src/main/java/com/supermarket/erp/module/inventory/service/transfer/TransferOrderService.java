package com.supermarket.erp.module.inventory.service.transfer;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.inventory.dal.dataobject.TransferOrderDO;
import com.supermarket.erp.module.inventory.dal.dataobject.TransferOrderItemDO;
import com.supermarket.erp.module.inventory.dal.mysql.TransferOrderMapper;
import com.supermarket.erp.module.inventory.dal.mysql.TransferOrderItemMapper;
import com.supermarket.erp.module.inventory.service.stock.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransferOrderService {

    private static final ErrorCode ORDER_NOT_FOUND = new ErrorCode(200301, "Transfer order not found");

    private final TransferOrderMapper transferOrderMapper;
    private final TransferOrderItemMapper transferOrderItemMapper;
    private final StockService stockService;

    private String generateOrderNo() {
        return "TRF" + System.currentTimeMillis();
    }

    public Long createOrder(TransferOrderDO order) {
        order.setOrderNo(generateOrderNo());
        order.setStatus(0);
        transferOrderMapper.insert(order);
        return order.getId();
    }

    public void addItem(TransferOrderItemDO item) {
        transferOrderItemMapper.insert(item);
    }

    public TransferOrderDO getOrder(Long id) {
        return transferOrderMapper.selectById(id);
    }

    public List<TransferOrderItemDO> getItems(Long orderId) {
        LambdaQueryWrapper<TransferOrderItemDO> query = new LambdaQueryWrapper<TransferOrderItemDO>()
                .eq(TransferOrderItemDO::getOrderId, orderId);
        return transferOrderItemMapper.selectList(query);
    }

    @Transactional
    public void confirmOrder(Long id) {
        TransferOrderDO order = transferOrderMapper.selectById(id);
        if (order == null) {
            throw new ServiceException(ORDER_NOT_FOUND);
        }
        if (order.getStatus() != 0) {
            return;
        }
        order.setStatus(2); // received
        transferOrderMapper.updateById(order);

        List<TransferOrderItemDO> items = getItems(id);
        for (TransferOrderItemDO item : items) {
            // Decrease from source location
            stockService.decreaseStock(item.getProductId(), order.getFromLocationType(), order.getFromLocationId(),
                    item.getQuantity(), 4 /* transfer_out */, order.getId());
            // Increase at target location
            stockService.increaseStock(item.getProductId(), order.getToLocationType(), order.getToLocationId(),
                    item.getQuantity(), null, 3 /* transfer_in */, order.getId());
        }
    }

    public PageResult<TransferOrderDO> getOrderPage(PageParam pageParam, Integer status) {
        LambdaQueryWrapper<TransferOrderDO> query = new LambdaQueryWrapper<TransferOrderDO>()
                .eq(status != null, TransferOrderDO::getStatus, status)
                .orderByDesc(TransferOrderDO::getId);
        return transferOrderMapper.selectPage(pageParam, query);
    }
}
