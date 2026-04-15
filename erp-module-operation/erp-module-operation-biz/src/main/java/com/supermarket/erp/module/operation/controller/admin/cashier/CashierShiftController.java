package com.supermarket.erp.module.operation.controller.admin.cashier;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.operation.dal.dataobject.CashierShiftDO;
import com.supermarket.erp.module.operation.service.cashier.CashierShiftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/operation/cashier-shift")
@RequiredArgsConstructor
public class CashierShiftController {

    private final CashierShiftService cashierShiftService;

    @PostMapping
    public CommonResult<Long> openShift(@RequestBody CashierShiftDO shift) {
        Long id = cashierShiftService.openShift(shift);
        return CommonResult.success(id);
    }

    @PostMapping("/{id}/close")
    public CommonResult<Boolean> closeShift(@PathVariable Long id) {
        cashierShiftService.closeShift(id);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<CashierShiftDO> getShift(@PathVariable Long id) {
        CashierShiftDO shift = cashierShiftService.getShift(id);
        return CommonResult.success(shift);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<CashierShiftDO>> getShiftPage(@Valid PageParam pageParam,
                                                                   @RequestParam(required = false) Long storeId,
                                                                   @RequestParam(required = false) Long cashierId,
                                                                   @RequestParam(required = false) Integer status) {
        PageResult<CashierShiftDO> page = cashierShiftService.getShiftPage(pageParam, storeId, cashierId, status);
        return CommonResult.success(page);
    }
}
