package com.supermarket.erp.module.operation.service.sales;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.operation.dal.dataobject.SalesOrderDO;
import com.supermarket.erp.module.operation.dal.dataobject.SalesOrderItemDO;
import com.supermarket.erp.module.operation.dal.mysql.SalesOrderMapper;
import com.supermarket.erp.module.operation.dal.mysql.SalesOrderItemMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesOrderService {

    private static final ErrorCode ORDER_NOT_FOUND = new ErrorCode(400001, "Sales order not found");

    private final SalesOrderMapper salesOrderMapper;
    private final SalesOrderItemMapper salesOrderItemMapper;

    private String generateOrderNo() {
        return "SAL" + System.currentTimeMillis();
    }

    @Transactional
    public Long createOrder(SalesOrderDO order, List<SalesOrderItemDO> items) {
        order.setOrderNo(generateOrderNo());
        order.setStatus(0); // pending_payment

        // Calculate totals from items
        BigDecimal totalAmount = items.stream()
                .map(SalesOrderItemDO::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal discountAmount = items.stream()
                .map(item -> item.getDiscountAmount() != null ? item.getDiscountAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(totalAmount);
        order.setItemCount(items.size());
        order.setDiscountAmount(discountAmount);
        order.setPayAmount(totalAmount.subtract(discountAmount));

        salesOrderMapper.insert(order);

        for (SalesOrderItemDO item : items) {
            item.setOrderId(order.getId());
            salesOrderItemMapper.insert(item);
        }

        return order.getId();
    }

    public SalesOrderDO getOrder(Long id) {
        return salesOrderMapper.selectById(id);
    }

    public List<SalesOrderItemDO> getItems(Long orderId) {
        LambdaQueryWrapper<SalesOrderItemDO> query = new LambdaQueryWrapper<SalesOrderItemDO>()
                .eq(SalesOrderItemDO::getOrderId, orderId);
        return salesOrderItemMapper.selectList(query);
    }

    public void completePayment(Long id) {
        SalesOrderDO order = validateOrderExists(id);
        order.setStatus(1); // paid
        salesOrderMapper.updateById(order);
    }

    public void completeOrder(Long id) {
        SalesOrderDO order = validateOrderExists(id);
        if (order.getStatus() != 1 && order.getStatus() != 2) {
            throw new ServiceException(400002, "Order must be paid or in progress to complete");
        }
        order.setStatus(3); // completed
        salesOrderMapper.updateById(order);
    }

    public void cancelOrder(Long id) {
        SalesOrderDO order = validateOrderExists(id);
        if (order.getStatus() != 0) {
            throw new ServiceException(400003, "Only pending payment orders can be cancelled");
        }
        order.setStatus(4); // cancelled
        salesOrderMapper.updateById(order);
    }

    public PageResult<SalesOrderDO> getOrderPage(PageParam pageParam, Integer channel, Integer status,
                                                   Long storeId, Long memberId) {
        LambdaQueryWrapper<SalesOrderDO> query = new LambdaQueryWrapper<SalesOrderDO>()
                .eq(channel != null, SalesOrderDO::getChannel, channel)
                .eq(status != null, SalesOrderDO::getStatus, status)
                .eq(storeId != null, SalesOrderDO::getStoreId, storeId)
                .eq(memberId != null, SalesOrderDO::getMemberId, memberId)
                .orderByDesc(SalesOrderDO::getId);
        return salesOrderMapper.selectPage(pageParam, query);
    }

    private SalesOrderDO validateOrderExists(Long id) {
        SalesOrderDO order = salesOrderMapper.selectById(id);
        if (order == null) {
            throw new ServiceException(ORDER_NOT_FOUND);
        }
        return order;
    }
}
