package com.supermarket.erp.module.finance.controller.admin.settlement;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.finance.dal.dataobject.SupplierSettlementDO;
import com.supermarket.erp.module.finance.service.settlement.SupplierSettlementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/finance/supplier-settlement")
@RequiredArgsConstructor
public class SupplierSettlementController {

    private final SupplierSettlementService supplierSettlementService;

    @PostMapping
    public CommonResult<Long> createSettlement(@RequestBody SupplierSettlementDO settlement) {
        Long id = supplierSettlementService.createSettlement(settlement);
        return CommonResult.success(id);
    }

    @PutMapping
    public CommonResult<Boolean> updateSettlement(@RequestBody SupplierSettlementDO settlement) {
        supplierSettlementService.updateSettlement(settlement);
        return CommonResult.success(true);
    }

    @PostMapping("/{id}/confirm")
    public CommonResult<Boolean> confirmSettlement(@PathVariable Long id) {
        supplierSettlementService.confirmSettlement(id);
        return CommonResult.success(true);
    }

    @PostMapping("/{id}/pay")
    public CommonResult<Boolean> paySettlement(@PathVariable Long id) {
        supplierSettlementService.paySettlement(id);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<SupplierSettlementDO> getSettlement(@PathVariable Long id) {
        SupplierSettlementDO settlement = supplierSettlementService.getSettlement(id);
        return CommonResult.success(settlement);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<SupplierSettlementDO>> getSettlementPage(@Valid PageParam pageParam,
                                                                             @RequestParam(required = false) Long supplierId,
                                                                             @RequestParam(required = false) Integer status) {
        PageResult<SupplierSettlementDO> page = supplierSettlementService.getSettlementPage(pageParam, supplierId, status);
        return CommonResult.success(page);
    }
}
