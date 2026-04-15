package com.supermarket.erp.module.purchase.controller.admin.order;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.purchase.dal.dataobject.PurchaseOrderDO;
import com.supermarket.erp.module.purchase.dal.dataobject.PurchaseOrderItemDO;
import com.supermarket.erp.module.purchase.service.order.PurchaseOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/purchase/order")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @PostMapping
    public CommonResult<Long> createOrder(@RequestBody PurchaseOrderDO order) {
        Long id = purchaseOrderService.createOrder(order);
        return CommonResult.success(id);
    }

    @PostMapping("/item")
    public CommonResult<Long> addItem(@RequestBody PurchaseOrderItemDO item) {
        Long id = purchaseOrderService.addItem(item);
        return CommonResult.success(id);
    }

    @PutMapping
    public CommonResult<Boolean> updateOrder(@RequestBody PurchaseOrderDO order) {
        purchaseOrderService.updateOrder(order);
        return CommonResult.success(true);
    }

    @DeleteMapping("/{id}")
    public CommonResult<Boolean> deleteOrder(@PathVariable Long id) {
        purchaseOrderService.deleteOrder(id);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<PurchaseOrderDO> getOrder(@PathVariable Long id) {
        PurchaseOrderDO order = purchaseOrderService.getOrder(id);
        return CommonResult.success(order);
    }

    @GetMapping("/{id}/items")
    public CommonResult<List<PurchaseOrderItemDO>> getItems(@PathVariable Long id) {
        List<PurchaseOrderItemDO> items = purchaseOrderService.getItems(id);
        return CommonResult.success(items);
    }

    @PostMapping("/{id}/approve")
    public CommonResult<Boolean> approveOrder(@PathVariable Long id) {
        purchaseOrderService.approveOrder(id);
        return CommonResult.success(true);
    }

    @PostMapping("/{id}/receive")
    public CommonResult<Boolean> receiveOrder(@PathVariable Long id,
                                               @RequestBody List<PurchaseOrderService.ReceiveItemRequest> items) {
        purchaseOrderService.receiveOrder(id, items);
        return CommonResult.success(true);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<PurchaseOrderDO>> getOrderPage(@Valid PageParam pageParam,
                                                                    @RequestParam(required = false) Integer type,
                                                                    @RequestParam(required = false) Integer status,
                                                                    @RequestParam(required = false) Long supplierId) {
        PageResult<PurchaseOrderDO> page = purchaseOrderService.getOrderPage(pageParam, type, status, supplierId);
        return CommonResult.success(page);
    }
}
