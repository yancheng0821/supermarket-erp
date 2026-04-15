package com.supermarket.erp.module.operation.service.refund;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.operation.dal.dataobject.RefundDO;
import com.supermarket.erp.module.operation.dal.dataobject.SalesOrderDO;
import com.supermarket.erp.module.operation.dal.mysql.RefundMapper;
import com.supermarket.erp.module.operation.dal.mysql.SalesOrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RefundService {

    private static final ErrorCode REFUND_NOT_FOUND = new ErrorCode(400301, "Refund not found");

    private final RefundMapper refundMapper;
    private final SalesOrderMapper salesOrderMapper;

    private String generateRefundNo() {
        return "RFD" + System.currentTimeMillis();
    }

    public Long createRefund(RefundDO refund) {
        refund.setRefundNo(generateRefundNo());
        refund.setStatus(0); // pending
        refundMapper.insert(refund);
        return refund.getId();
    }

    public void approveRefund(Long id) {
        RefundDO refund = validateRefundExists(id);
        if (refund.getStatus() != 0) {
            throw new ServiceException(400302, "Only pending refunds can be approved");
        }
        refund.setStatus(1); // approved
        refundMapper.updateById(refund);
    }

    @Transactional
    public void completeRefund(Long id) {
        RefundDO refund = validateRefundExists(id);
        if (refund.getStatus() != 1) {
            throw new ServiceException(400303, "Only approved refunds can be completed");
        }
        refund.setStatus(2); // completed
        refundMapper.updateById(refund);

        // Update order status to refunded
        SalesOrderDO order = salesOrderMapper.selectById(refund.getOrderId());
        if (order != null) {
            order.setStatus(5); // refunded
            salesOrderMapper.updateById(order);
        }
    }

    public void rejectRefund(Long id) {
        RefundDO refund = validateRefundExists(id);
        if (refund.getStatus() != 0) {
            throw new ServiceException(400304, "Only pending refunds can be rejected");
        }
        refund.setStatus(3); // rejected
        refundMapper.updateById(refund);
    }

    public PageResult<RefundDO> getRefundPage(PageParam pageParam, Integer status, Long orderId) {
        LambdaQueryWrapper<RefundDO> query = new LambdaQueryWrapper<RefundDO>()
                .eq(status != null, RefundDO::getStatus, status)
                .eq(orderId != null, RefundDO::getOrderId, orderId)
                .orderByDesc(RefundDO::getId);
        return refundMapper.selectPage(pageParam, query);
    }

    private RefundDO validateRefundExists(Long id) {
        RefundDO refund = refundMapper.selectById(id);
        if (refund == null) {
            throw new ServiceException(REFUND_NOT_FOUND);
        }
        return refund;
    }
}
