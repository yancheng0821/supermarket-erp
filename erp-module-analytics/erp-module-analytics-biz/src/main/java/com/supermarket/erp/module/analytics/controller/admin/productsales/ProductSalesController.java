package com.supermarket.erp.module.analytics.controller.admin.productsales;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.analytics.dal.dataobject.ProductSalesDO;
import com.supermarket.erp.module.analytics.service.productsales.ProductSalesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/analytics/product-sales")
@RequiredArgsConstructor
public class ProductSalesController {

    private final ProductSalesService productSalesService;

    @GetMapping("/page")
    public CommonResult<PageResult<ProductSalesDO>> getProductSalesPage(@Valid PageParam pageParam,
                                                                         @RequestParam(required = false) Long storeId,
                                                                         @RequestParam(required = false) Long productId,
                                                                         @RequestParam(required = false) String startDate,
                                                                         @RequestParam(required = false) String endDate) {
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;
        PageResult<ProductSalesDO> page = productSalesService.getProductSalesPage(pageParam, storeId, productId, start, end);
        return CommonResult.success(page);
    }

    @GetMapping("/top")
    public CommonResult<List<ProductSalesDO>> getTopProducts(@RequestParam Long storeId,
                                                              @RequestParam String date,
                                                              @RequestParam(defaultValue = "10") Integer limit) {
        LocalDate reportDate = LocalDate.parse(date);
        List<ProductSalesDO> result = productSalesService.getTopProducts(storeId, reportDate, limit);
        return CommonResult.success(result);
    }
}
