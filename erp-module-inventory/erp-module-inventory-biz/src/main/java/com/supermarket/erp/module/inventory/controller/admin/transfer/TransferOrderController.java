package com.supermarket.erp.module.inventory.controller.admin.transfer;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.inventory.dal.dataobject.TransferOrderDO;
import com.supermarket.erp.module.inventory.dal.dataobject.TransferOrderItemDO;
import com.supermarket.erp.module.inventory.service.transfer.TransferOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/inventory/transfer")
@RequiredArgsConstructor
public class TransferOrderController {

    private final TransferOrderService transferOrderService;

    @PostMapping
    public CommonResult<Long> createOrder(@RequestBody TransferOrderDO order) {
        Long id = transferOrderService.createOrder(order);
        return CommonResult.success(id);
    }

    @PostMapping("/item")
    public CommonResult<Boolean> addItem(@RequestBody TransferOrderItemDO item) {
        transferOrderService.addItem(item);
        return CommonResult.success(true);
    }

    @PostMapping("/{id}/confirm")
    public CommonResult<Boolean> confirmOrder(@PathVariable Long id) {
        transferOrderService.confirmOrder(id);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<TransferOrderDO> getOrder(@PathVariable Long id) {
        TransferOrderDO order = transferOrderService.getOrder(id);
        return CommonResult.success(order);
    }

    @GetMapping("/{id}/items")
    public CommonResult<List<TransferOrderItemDO>> getItems(@PathVariable Long id) {
        List<TransferOrderItemDO> items = transferOrderService.getItems(id);
        return CommonResult.success(items);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<TransferOrderDO>> getOrderPage(@Valid PageParam pageParam,
                                                                    @RequestParam(required = false) Integer status) {
        PageResult<TransferOrderDO> page = transferOrderService.getOrderPage(pageParam, status);
        return CommonResult.success(page);
    }
}
