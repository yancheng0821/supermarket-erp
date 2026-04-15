package com.supermarket.erp.module.operation.controller.admin.refund;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.operation.dal.dataobject.RefundDO;
import com.supermarket.erp.module.operation.service.refund.RefundService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/operation/refund")
@RequiredArgsConstructor
public class RefundController {

    private final RefundService refundService;

    @PostMapping
    public CommonResult<Long> createRefund(@RequestBody RefundDO refund) {
        Long id = refundService.createRefund(refund);
        return CommonResult.success(id);
    }

    @PostMapping("/{id}/approve")
    public CommonResult<Boolean> approveRefund(@PathVariable Long id) {
        refundService.approveRefund(id);
        return CommonResult.success(true);
    }

    @PostMapping("/{id}/complete")
    public CommonResult<Boolean> completeRefund(@PathVariable Long id) {
        refundService.completeRefund(id);
        return CommonResult.success(true);
    }

    @PostMapping("/{id}/reject")
    public CommonResult<Boolean> rejectRefund(@PathVariable Long id) {
        refundService.rejectRefund(id);
        return CommonResult.success(true);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<RefundDO>> getRefundPage(@Valid PageParam pageParam,
                                                             @RequestParam(required = false) Integer status,
                                                             @RequestParam(required = false) Long orderId) {
        PageResult<RefundDO> page = refundService.getRefundPage(pageParam, status, orderId);
        return CommonResult.success(page);
    }
}
