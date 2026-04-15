package com.supermarket.erp.module.operation.service.payment;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.operation.dal.dataobject.PaymentDO;
import com.supermarket.erp.module.operation.dal.dataobject.SalesOrderDO;
import com.supermarket.erp.module.operation.dal.mysql.PaymentMapper;
import com.supermarket.erp.module.operation.dal.mysql.SalesOrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final ErrorCode PAYMENT_NOT_FOUND = new ErrorCode(400101, "Payment not found");

    private final PaymentMapper paymentMapper;
    private final SalesOrderMapper salesOrderMapper;

    private String generatePaymentNo() {
        return "PAY" + System.currentTimeMillis();
    }

    @Transactional
    public Long createPayment(PaymentDO payment) {
        payment.setPaymentNo(generatePaymentNo());
        payment.setStatus(0); // pending
        paymentMapper.insert(payment);
        return payment.getId();
    }

    public void confirmPayment(Long id) {
        PaymentDO payment = validatePaymentExists(id);
        payment.setStatus(1); // success
        paymentMapper.updateById(payment);

        // Check if order is fully paid
        SalesOrderDO order = salesOrderMapper.selectById(payment.getOrderId());
        if (order != null) {
            LambdaQueryWrapper<PaymentDO> query = new LambdaQueryWrapper<PaymentDO>()
                    .eq(PaymentDO::getOrderId, payment.getOrderId())
                    .eq(PaymentDO::getStatus, 1); // success
            List<PaymentDO> successPayments = paymentMapper.selectList(query);

            BigDecimal totalPaid = successPayments.stream()
                    .map(PaymentDO::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            if (totalPaid.compareTo(order.getPayAmount()) >= 0) {
                order.setStatus(1); // paid
                salesOrderMapper.updateById(order);
            }
        }
    }

    public List<PaymentDO> getPaymentsByOrder(Long orderId) {
        LambdaQueryWrapper<PaymentDO> query = new LambdaQueryWrapper<PaymentDO>()
                .eq(PaymentDO::getOrderId, orderId)
                .orderByDesc(PaymentDO::getId);
        return paymentMapper.selectList(query);
    }

    public PageResult<PaymentDO> getPaymentPage(PageParam pageParam, Integer method, Integer status) {
        LambdaQueryWrapper<PaymentDO> query = new LambdaQueryWrapper<PaymentDO>()
                .eq(method != null, PaymentDO::getMethod, method)
                .eq(status != null, PaymentDO::getStatus, status)
                .orderByDesc(PaymentDO::getId);
        return paymentMapper.selectPage(pageParam, query);
    }

    private PaymentDO validatePaymentExists(Long id) {
        PaymentDO payment = paymentMapper.selectById(id);
        if (payment == null) {
            throw new ServiceException(PAYMENT_NOT_FOUND);
        }
        return payment;
    }
}
