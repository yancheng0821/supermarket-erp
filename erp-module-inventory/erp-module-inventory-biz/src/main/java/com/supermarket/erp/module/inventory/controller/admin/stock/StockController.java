package com.supermarket.erp.module.inventory.controller.admin.stock;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.inventory.dal.dataobject.StockDO;
import com.supermarket.erp.module.inventory.service.stock.StockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/inventory/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping("/page")
    public CommonResult<PageResult<StockDO>> getStockPage(@Valid PageParam pageParam,
                                                           @RequestParam(required = false) Long productId,
                                                           @RequestParam(required = false) Long locationId) {
        PageResult<StockDO> page = stockService.getStockPage(pageParam, productId, locationId);
        return CommonResult.success(page);
    }

    @GetMapping("/{productId}/{locationType}/{locationId}")
    public CommonResult<StockDO> getStock(@PathVariable Long productId,
                                           @PathVariable Integer locationType,
                                           @PathVariable Long locationId) {
        StockDO stock = stockService.getOrCreateStock(productId, locationType, locationId);
        return CommonResult.success(stock);
    }
}
