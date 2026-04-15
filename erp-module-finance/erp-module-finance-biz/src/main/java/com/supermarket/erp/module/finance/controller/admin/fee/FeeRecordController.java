package com.supermarket.erp.module.finance.controller.admin.fee;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.finance.dal.dataobject.FeeRecordDO;
import com.supermarket.erp.module.finance.service.fee.FeeRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/finance/fee")
@RequiredArgsConstructor
public class FeeRecordController {

    private final FeeRecordService feeRecordService;

    @PostMapping
    public CommonResult<Long> createFee(@RequestBody FeeRecordDO fee) {
        Long id = feeRecordService.createFee(fee);
        return CommonResult.success(id);
    }

    @PostMapping("/{id}/confirm")
    public CommonResult<Boolean> confirmFee(@PathVariable Long id) {
        feeRecordService.confirmFee(id);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<FeeRecordDO> getFee(@PathVariable Long id) {
        FeeRecordDO fee = feeRecordService.getFee(id);
        return CommonResult.success(fee);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<FeeRecordDO>> getFeePage(@Valid PageParam pageParam,
                                                             @RequestParam(required = false) Integer type,
                                                             @RequestParam(required = false) Integer targetType,
                                                             @RequestParam(required = false) Long targetId,
                                                             @RequestParam(required = false) Integer status) {
        PageResult<FeeRecordDO> page = feeRecordService.getFeePage(pageParam, type, targetType, targetId, status);
        return CommonResult.success(page);
    }
}
