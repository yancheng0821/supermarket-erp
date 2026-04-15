package com.supermarket.erp.module.online.controller.admin;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.online.dal.dataobject.DeliveryOrderDO;
import com.supermarket.erp.module.online.service.delivery.DeliveryOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/online/delivery")
@RequiredArgsConstructor
public class DeliveryOrderController {

    private final DeliveryOrderService deliveryOrderService;

    @PostMapping
    public CommonResult<Long> createOrder(@RequestBody DeliveryOrderDO order) {
        Long id = deliveryOrderService.createOrder(order);
        return CommonResult.success(id);
    }

    @PostMapping("/{id}/status")
    public CommonResult<Boolean> updateStatus(@PathVariable Long id,
                                               @RequestParam Integer status) {
        deliveryOrderService.updateStatus(id, status);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<DeliveryOrderDO> getOrder(@PathVariable Long id) {
        DeliveryOrderDO order = deliveryOrderService.getOrder(id);
        return CommonResult.success(order);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<DeliveryOrderDO>> getOrderPage(@Valid PageParam pageParam,
                                                                    @RequestParam(required = false) Long storeId,
                                                                    @RequestParam(required = false) Integer deliveryType,
                                                                    @RequestParam(required = false) Integer status) {
        PageResult<DeliveryOrderDO> page = deliveryOrderService.getOrderPage(pageParam, storeId, deliveryType, status);
        return CommonResult.success(page);
    }
}
