package com.supermarket.erp.module.inventory.controller.admin.receipt;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.inventory.dal.dataobject.ReceiptOrderDO;
import com.supermarket.erp.module.inventory.dal.dataobject.ReceiptOrderItemDO;
import com.supermarket.erp.module.inventory.service.receipt.ReceiptOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/inventory/receipt")
@RequiredArgsConstructor
public class ReceiptOrderController {

    private final ReceiptOrderService receiptOrderService;

    @PostMapping
    public CommonResult<Long> createOrder(@RequestBody ReceiptOrderDO order) {
        Long id = receiptOrderService.createOrder(order);
        return CommonResult.success(id);
    }

    @PostMapping("/item")
    public CommonResult<Boolean> addItem(@RequestBody ReceiptOrderItemDO item) {
        receiptOrderService.addItem(item);
        return CommonResult.success(true);
    }

    @PostMapping("/{id}/confirm")
    public CommonResult<Boolean> confirmOrder(@PathVariable Long id) {
        receiptOrderService.confirmOrder(id);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<ReceiptOrderDO> getOrder(@PathVariable Long id) {
        ReceiptOrderDO order = receiptOrderService.getOrder(id);
        return CommonResult.success(order);
    }

    @GetMapping("/{id}/items")
    public CommonResult<List<ReceiptOrderItemDO>> getItems(@PathVariable Long id) {
        List<ReceiptOrderItemDO> items = receiptOrderService.getItems(id);
        return CommonResult.success(items);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<ReceiptOrderDO>> getOrderPage(@Valid PageParam pageParam,
                                                                   @RequestParam(required = false) Integer type,
                                                                   @RequestParam(required = false) Integer status) {
        PageResult<ReceiptOrderDO> page = receiptOrderService.getOrderPage(pageParam, type, status);
        return CommonResult.success(page);
    }
}
