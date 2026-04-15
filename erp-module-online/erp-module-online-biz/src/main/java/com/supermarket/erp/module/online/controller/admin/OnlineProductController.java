package com.supermarket.erp.module.online.controller.admin;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.online.dal.dataobject.OnlineProductDO;
import com.supermarket.erp.module.online.service.product.OnlineProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/online/product")
@RequiredArgsConstructor
public class OnlineProductController {

    private final OnlineProductService onlineProductService;

    @PostMapping
    public CommonResult<Long> createProduct(@RequestBody OnlineProductDO product) {
        Long id = onlineProductService.createProduct(product);
        return CommonResult.success(id);
    }

    @PutMapping
    public CommonResult<Boolean> updateProduct(@RequestBody OnlineProductDO product) {
        onlineProductService.updateProduct(product);
        return CommonResult.success(true);
    }

    @DeleteMapping("/{id}")
    public CommonResult<Boolean> deleteProduct(@PathVariable Long id) {
        onlineProductService.deleteProduct(id);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<OnlineProductDO> getProduct(@PathVariable Long id) {
        OnlineProductDO product = onlineProductService.getProduct(id);
        return CommonResult.success(product);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<OnlineProductDO>> getProductPage(@Valid PageParam pageParam,
                                                                     @RequestParam(required = false) Long storeId,
                                                                     @RequestParam(required = false) Long productId,
                                                                     @RequestParam(required = false) Integer status) {
        PageResult<OnlineProductDO> page = onlineProductService.getProductPage(pageParam, storeId, productId, status);
        return CommonResult.success(page);
    }
}
