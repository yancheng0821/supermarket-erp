package com.supermarket.erp.module.inventory.controller.admin.issue;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.inventory.dal.dataobject.IssueOrderDO;
import com.supermarket.erp.module.inventory.dal.dataobject.IssueOrderItemDO;
import com.supermarket.erp.module.inventory.service.issue.IssueOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/inventory/issue")
@RequiredArgsConstructor
public class IssueOrderController {

    private final IssueOrderService issueOrderService;

    @PostMapping
    public CommonResult<Long> createOrder(@RequestBody IssueOrderDO order) {
        Long id = issueOrderService.createOrder(order);
        return CommonResult.success(id);
    }

    @PostMapping("/item")
    public CommonResult<Boolean> addItem(@RequestBody IssueOrderItemDO item) {
        issueOrderService.addItem(item);
        return CommonResult.success(true);
    }

    @PostMapping("/{id}/confirm")
    public CommonResult<Boolean> confirmOrder(@PathVariable Long id) {
        issueOrderService.confirmOrder(id);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<IssueOrderDO> getOrder(@PathVariable Long id) {
        IssueOrderDO order = issueOrderService.getOrder(id);
        return CommonResult.success(order);
    }

    @GetMapping("/{id}/items")
    public CommonResult<List<IssueOrderItemDO>> getItems(@PathVariable Long id) {
        List<IssueOrderItemDO> items = issueOrderService.getItems(id);
        return CommonResult.success(items);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<IssueOrderDO>> getOrderPage(@Valid PageParam pageParam,
                                                                 @RequestParam(required = false) Integer type,
                                                                 @RequestParam(required = false) Integer status) {
        PageResult<IssueOrderDO> page = issueOrderService.getOrderPage(pageParam, type, status);
        return CommonResult.success(page);
    }
}
