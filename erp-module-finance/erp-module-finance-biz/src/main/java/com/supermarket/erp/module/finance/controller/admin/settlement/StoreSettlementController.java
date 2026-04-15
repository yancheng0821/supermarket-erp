package com.supermarket.erp.module.finance.controller.admin.settlement;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.finance.dal.dataobject.StoreSettlementDO;
import com.supermarket.erp.module.finance.service.settlement.StoreSettlementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/finance/store-settlement")
@RequiredArgsConstructor
public class StoreSettlementController {

    private final StoreSettlementService storeSettlementService;

    @PostMapping
    public CommonResult<Long> createSettlement(@RequestBody StoreSettlementDO settlement) {
        Long id = storeSettlementService.createSettlement(settlement);
        return CommonResult.success(id);
    }

    @PutMapping
    public CommonResult<Boolean> updateSettlement(@RequestBody StoreSettlementDO settlement) {
        storeSettlementService.updateSettlement(settlement);
        return CommonResult.success(true);
    }

    @PostMapping("/{id}/confirm")
    public CommonResult<Boolean> confirmSettlement(@PathVariable Long id) {
        storeSettlementService.confirmSettlement(id);
        return CommonResult.success(true);
    }

    @PostMapping("/{id}/pay")
    public CommonResult<Boolean> paySettlement(@PathVariable Long id) {
        storeSettlementService.paySettlement(id);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<StoreSettlementDO> getSettlement(@PathVariable Long id) {
        StoreSettlementDO settlement = storeSettlementService.getSettlement(id);
        return CommonResult.success(settlement);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<StoreSettlementDO>> getSettlementPage(@Valid PageParam pageParam,
                                                                          @RequestParam(required = false) Long storeId,
                                                                          @RequestParam(required = false) Integer status) {
        PageResult<StoreSettlementDO> page = storeSettlementService.getSettlementPage(pageParam, storeId, status);
        return CommonResult.success(page);
    }
}
