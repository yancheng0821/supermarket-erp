package com.supermarket.erp.module.purchase.controller.admin.replenish;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.purchase.dal.dataobject.ReplenishPlanDO;
import com.supermarket.erp.module.purchase.service.replenish.ReplenishPlanService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/purchase/replenish")
@RequiredArgsConstructor
public class ReplenishPlanController {

    private final ReplenishPlanService replenishPlanService;

    @PostMapping
    public CommonResult<Long> createPlan(@RequestBody ReplenishPlanDO plan) {
        Long id = replenishPlanService.createPlan(plan);
        return CommonResult.success(id);
    }

    @PostMapping("/{id}/approve")
    public CommonResult<Boolean> approvePlan(@PathVariable Long id) {
        replenishPlanService.approvePlan(id);
        return CommonResult.success(true);
    }

    @PostMapping("/convert")
    public CommonResult<Long> convertToPurchaseOrder(@RequestBody ConvertRequest request) {
        Long orderId = replenishPlanService.convertToPurchaseOrder(request.getPlanIds(), request.getSupplierId());
        return CommonResult.success(orderId);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<ReplenishPlanDO>> getPlanPage(@Valid PageParam pageParam,
                                                                   @RequestParam(required = false) Long storeId,
                                                                   @RequestParam(required = false) Integer status) {
        PageResult<ReplenishPlanDO> page = replenishPlanService.getPlanPage(pageParam, storeId, status);
        return CommonResult.success(page);
    }

    @Data
    public static class ConvertRequest {
        private List<Long> planIds;
        private Long supplierId;
    }
}
