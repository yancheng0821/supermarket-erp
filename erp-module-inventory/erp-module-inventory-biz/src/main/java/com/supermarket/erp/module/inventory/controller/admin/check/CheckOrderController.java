package com.supermarket.erp.module.inventory.controller.admin.check;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.inventory.dal.dataobject.CheckOrderDO;
import com.supermarket.erp.module.inventory.dal.dataobject.CheckOrderItemDO;
import com.supermarket.erp.module.inventory.service.check.CheckOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/inventory/check")
@RequiredArgsConstructor
public class CheckOrderController {

    private final CheckOrderService checkOrderService;

    @PostMapping
    public CommonResult<Long> createOrder(@RequestBody CheckOrderDO order) {
        Long id = checkOrderService.createOrder(order);
        return CommonResult.success(id);
    }

    @PostMapping("/item")
    public CommonResult<Boolean> addItem(@RequestBody CheckOrderItemDO item) {
        checkOrderService.addItem(item);
        return CommonResult.success(true);
    }

    @PostMapping("/{id}/confirm")
    public CommonResult<Boolean> confirmOrder(@PathVariable Long id) {
        checkOrderService.confirmOrder(id);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<CheckOrderDO> getOrder(@PathVariable Long id) {
        CheckOrderDO order = checkOrderService.getOrder(id);
        return CommonResult.success(order);
    }

    @GetMapping("/{id}/items")
    public CommonResult<List<CheckOrderItemDO>> getItems(@PathVariable Long id) {
        List<CheckOrderItemDO> items = checkOrderService.getItems(id);
        return CommonResult.success(items);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<CheckOrderDO>> getOrderPage(@Valid PageParam pageParam,
                                                                 @RequestParam(required = false) Integer status) {
        PageResult<CheckOrderDO> page = checkOrderService.getOrderPage(pageParam, status);
        return CommonResult.success(page);
    }
}
