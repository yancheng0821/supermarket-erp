package com.supermarket.erp.module.operation.controller.admin.sales;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.operation.dal.dataobject.SalesOrderDO;
import com.supermarket.erp.module.operation.dal.dataobject.SalesOrderItemDO;
import com.supermarket.erp.module.operation.service.sales.SalesOrderService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/operation/sales")
@RequiredArgsConstructor
public class SalesOrderController {

    private final SalesOrderService salesOrderService;

    @PostMapping
    public CommonResult<Long> createOrder(@RequestBody CreateSalesOrderRequest request) {
        SalesOrderDO order = new SalesOrderDO();
        order.setChannel(request.getChannel());
        order.setStoreId(request.getStoreId());
        order.setMemberId(request.getMemberId());
        order.setRemark(request.getRemark());

        List<SalesOrderItemDO> items = new ArrayList<>();
        if (request.getItems() != null) {
            for (ItemRequest itemReq : request.getItems()) {
                SalesOrderItemDO item = new SalesOrderItemDO();
                item.setProductId(itemReq.getProductId());
                item.setProductName(itemReq.getProductName());
                item.setQuantity(itemReq.getQuantity());
                item.setUnitPrice(itemReq.getUnitPrice());
                item.setDiscountAmount(itemReq.getDiscountAmount() != null ? itemReq.getDiscountAmount() : BigDecimal.ZERO);
                item.setAmount(itemReq.getQuantity().multiply(itemReq.getUnitPrice())
                        .subtract(item.getDiscountAmount()));
                items.add(item);
            }
        }

        Long id = salesOrderService.createOrder(order, items);
        return CommonResult.success(id);
    }

    @GetMapping("/{id}")
    public CommonResult<SalesOrderDO> getOrder(@PathVariable Long id) {
        SalesOrderDO order = salesOrderService.getOrder(id);
        return CommonResult.success(order);
    }

    @GetMapping("/{id}/items")
    public CommonResult<List<SalesOrderItemDO>> getItems(@PathVariable Long id) {
        List<SalesOrderItemDO> items = salesOrderService.getItems(id);
        return CommonResult.success(items);
    }

    @PostMapping("/{id}/complete-payment")
    public CommonResult<Boolean> completePayment(@PathVariable Long id) {
        salesOrderService.completePayment(id);
        return CommonResult.success(true);
    }

    @PostMapping("/{id}/complete")
    public CommonResult<Boolean> completeOrder(@PathVariable Long id) {
        salesOrderService.completeOrder(id);
        return CommonResult.success(true);
    }

    @PostMapping("/{id}/cancel")
    public CommonResult<Boolean> cancelOrder(@PathVariable Long id) {
        salesOrderService.cancelOrder(id);
        return CommonResult.success(true);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<SalesOrderDO>> getOrderPage(@Valid PageParam pageParam,
                                                                @RequestParam(required = false) Integer channel,
                                                                @RequestParam(required = false) Integer status,
                                                                @RequestParam(required = false) Long storeId,
                                                                @RequestParam(required = false) Long memberId) {
        PageResult<SalesOrderDO> page = salesOrderService.getOrderPage(pageParam, channel, status, storeId, memberId);
        return CommonResult.success(page);
    }

    @Data
    public static class CreateSalesOrderRequest {
        private Integer channel;
        private Long storeId;
        private Long memberId;
        private String remark;
        private List<ItemRequest> items;
    }

    @Data
    public static class ItemRequest {
        private Long productId;
        private String productName;
        private BigDecimal quantity;
        private BigDecimal unitPrice;
        private BigDecimal discountAmount;
    }
}
