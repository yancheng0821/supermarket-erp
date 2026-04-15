package com.supermarket.erp.module.purchase.service.order;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.purchase.dal.dataobject.PurchaseOrderDO;
import com.supermarket.erp.module.purchase.dal.dataobject.PurchaseOrderItemDO;
import com.supermarket.erp.module.purchase.dal.mysql.PurchaseOrderMapper;
import com.supermarket.erp.module.purchase.dal.mysql.PurchaseOrderItemMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

    private static final ErrorCode ORDER_NOT_FOUND = new ErrorCode(300001, "Purchase order not found");

    private final PurchaseOrderMapper purchaseOrderMapper;
    private final PurchaseOrderItemMapper purchaseOrderItemMapper;

    private String generateOrderNo() {
        return "PUR" + System.currentTimeMillis();
    }

    public Long createOrder(PurchaseOrderDO order) {
        order.setOrderNo(generateOrderNo());
        order.setStatus(0); // draft
        purchaseOrderMapper.insert(order);
        return order.getId();
    }

    public Long addItem(PurchaseOrderItemDO item) {
        if (item.getQuantity() != null && item.getCostPrice() != null) {
            item.setAmount(item.getQuantity().multiply(item.getCostPrice()));
        }
        purchaseOrderItemMapper.insert(item);
        return item.getId();
    }

    public void updateOrder(PurchaseOrderDO order) {
        validateOrderExists(order.getId());
        purchaseOrderMapper.updateById(order);
    }

    public void deleteOrder(Long id) {
        PurchaseOrderDO order = validateOrderExists(id);
        if (order.getStatus() != 0) {
            throw new ServiceException(300002, "Only draft orders can be deleted");
        }
        purchaseOrderMapper.deleteById(id);
    }

    public PurchaseOrderDO getOrder(Long id) {
        return purchaseOrderMapper.selectById(id);
    }

    public List<PurchaseOrderItemDO> getItems(Long orderId) {
        LambdaQueryWrapper<PurchaseOrderItemDO> query = new LambdaQueryWrapper<PurchaseOrderItemDO>()
                .eq(PurchaseOrderItemDO::getOrderId, orderId);
        return purchaseOrderItemMapper.selectList(query);
    }

    public void approveOrder(Long id) {
        PurchaseOrderDO order = validateOrderExists(id);
        if (order.getStatus() != 0) {
            throw new ServiceException(300003, "Only draft orders can be approved");
        }
        order.setStatus(2); // approved
        purchaseOrderMapper.updateById(order);
    }

    @Transactional
    public void receiveOrder(Long orderId, List<ReceiveItemRequest> items) {
        PurchaseOrderDO order = validateOrderExists(orderId);

        for (ReceiveItemRequest request : items) {
            PurchaseOrderItemDO item = purchaseOrderItemMapper.selectById(request.getItemId());
            if (item == null) {
                continue;
            }
            BigDecimal newReceived = item.getReceivedQuantity() != null
                    ? item.getReceivedQuantity().add(request.getReceivedQuantity())
                    : request.getReceivedQuantity();
            item.setReceivedQuantity(newReceived);
            purchaseOrderItemMapper.updateById(item);
        }

        // Re-fetch all items to determine order status
        List<PurchaseOrderItemDO> allItems = getItems(orderId);
        boolean allReceived = allItems.stream().allMatch(item ->
                item.getReceivedQuantity() != null
                        && item.getQuantity() != null
                        && item.getReceivedQuantity().compareTo(item.getQuantity()) >= 0);

        if (allReceived) {
            order.setStatus(5); // completed
        } else {
            order.setStatus(4); // partially_received
        }

        // Recalculate totalAmount
        BigDecimal totalAmount = allItems.stream()
                .map(item -> item.getAmount() != null ? item.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(totalAmount);

        purchaseOrderMapper.updateById(order);
    }

    public PageResult<PurchaseOrderDO> getOrderPage(PageParam pageParam, Integer type, Integer status, Long supplierId) {
        LambdaQueryWrapper<PurchaseOrderDO> query = new LambdaQueryWrapper<PurchaseOrderDO>()
                .eq(type != null, PurchaseOrderDO::getType, type)
                .eq(status != null, PurchaseOrderDO::getStatus, status)
                .eq(supplierId != null, PurchaseOrderDO::getSupplierId, supplierId)
                .orderByDesc(PurchaseOrderDO::getId);
        return purchaseOrderMapper.selectPage(pageParam, query);
    }

    private PurchaseOrderDO validateOrderExists(Long id) {
        PurchaseOrderDO order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new ServiceException(ORDER_NOT_FOUND);
        }
        return order;
    }

    @Data
    public static class ReceiveItemRequest {
        private Long itemId;
        private BigDecimal receivedQuantity;
    }
}
