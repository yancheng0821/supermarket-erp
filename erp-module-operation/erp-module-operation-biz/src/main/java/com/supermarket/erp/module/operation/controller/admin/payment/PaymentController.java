package com.supermarket.erp.module.operation.controller.admin.payment;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.operation.dal.dataobject.PaymentDO;
import com.supermarket.erp.module.operation.service.payment.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/operation/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public CommonResult<Long> createPayment(@RequestBody PaymentDO payment) {
        Long id = paymentService.createPayment(payment);
        return CommonResult.success(id);
    }

    @PostMapping("/{id}/confirm")
    public CommonResult<Boolean> confirmPayment(@PathVariable Long id) {
        paymentService.confirmPayment(id);
        return CommonResult.success(true);
    }

    @GetMapping("/order/{orderId}")
    public CommonResult<List<PaymentDO>> getPaymentsByOrder(@PathVariable Long orderId) {
        List<PaymentDO> payments = paymentService.getPaymentsByOrder(orderId);
        return CommonResult.success(payments);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<PaymentDO>> getPaymentPage(@Valid PageParam pageParam,
                                                               @RequestParam(required = false) Integer method,
                                                               @RequestParam(required = false) Integer status) {
        PageResult<PaymentDO> page = paymentService.getPaymentPage(pageParam, method, status);
        return CommonResult.success(page);
    }
}
