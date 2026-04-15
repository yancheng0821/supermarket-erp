package com.supermarket.erp.module.online.service.delivery;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.online.dal.dataobject.DeliveryOrderDO;
import com.supermarket.erp.module.online.dal.mysql.DeliveryOrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DeliveryOrderService {

    private static final ErrorCode ORDER_NOT_FOUND = new ErrorCode(600201, "Delivery order not found");

    private final DeliveryOrderMapper deliveryOrderMapper;

    private String generateOrderNo() {
        return "DLV" + System.currentTimeMillis();
    }

    public Long createOrder(DeliveryOrderDO order) {
        order.setOrderNo(generateOrderNo());
        order.setStatus(0); // pending
        deliveryOrderMapper.insert(order);
        return order.getId();
    }

    public void updateStatus(Long id, Integer status) {
        DeliveryOrderDO order = validateOrderExists(id);
        order.setStatus(status);
        if (status == 3) { // completed
            order.setActualTime(LocalDateTime.now());
        }
        deliveryOrderMapper.updateById(order);
    }

    public DeliveryOrderDO getOrder(Long id) {
        return deliveryOrderMapper.selectById(id);
    }

    public DeliveryOrderDO getOrderBySalesOrder(Long salesOrderId) {
        return deliveryOrderMapper.selectOne(new LambdaQueryWrapper<DeliveryOrderDO>()
                .eq(DeliveryOrderDO::getSalesOrderId, salesOrderId));
    }

    public PageResult<DeliveryOrderDO> getOrderPage(PageParam pageParam, Long storeId,
                                                      Integer deliveryType, Integer status) {
        LambdaQueryWrapper<DeliveryOrderDO> query = new LambdaQueryWrapper<DeliveryOrderDO>()
                .eq(storeId != null, DeliveryOrderDO::getStoreId, storeId)
                .eq(deliveryType != null, DeliveryOrderDO::getDeliveryType, deliveryType)
                .eq(status != null, DeliveryOrderDO::getStatus, status)
                .orderByDesc(DeliveryOrderDO::getId);
        return deliveryOrderMapper.selectPage(pageParam, query);
    }

    private DeliveryOrderDO validateOrderExists(Long id) {
        DeliveryOrderDO order = deliveryOrderMapper.selectById(id);
        if (order == null) {
            throw new ServiceException(ORDER_NOT_FOUND);
        }
        return order;
    }
}
