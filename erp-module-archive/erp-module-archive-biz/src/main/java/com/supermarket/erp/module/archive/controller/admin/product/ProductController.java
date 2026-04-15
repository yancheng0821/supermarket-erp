package com.supermarket.erp.module.archive.controller.admin.product;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.archive.dal.dataobject.ProductDO;
import com.supermarket.erp.module.archive.dal.dataobject.ProductPriceDO;
import com.supermarket.erp.module.archive.service.product.ProductService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/admin/archive/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public CommonResult<Long> createProduct(@RequestBody CreateProductRequest request) {
        // Build ProductDO
        ProductDO product = new ProductDO();
        product.setName(request.getName());
        product.setBarcode(request.getBarcode());
        product.setCategoryId(request.getCategoryId());
        product.setSupplierId(request.getSupplierId());
        product.setSpec(request.getSpec());
        product.setUnit(request.getUnit());
        product.setShelfLife(request.getShelfLife());
        product.setImageUrl(request.getImageUrl());
        product.setStatus(request.getStatus());
        product.setRemark(request.getRemark());

        // Build optional ProductPriceDO
        ProductPriceDO price = null;
        if (request.getCostPrice() != null || request.getRetailPrice() != null || request.getVipPrice() != null) {
            price = new ProductPriceDO();
            price.setCostPrice(request.getCostPrice());
            price.setRetailPrice(request.getRetailPrice());
            price.setVipPrice(request.getVipPrice());
        }

        Long id = productService.createProduct(product, price);
        return CommonResult.success(id);
    }

    @PutMapping
    public CommonResult<Boolean> updateProduct(@RequestBody ProductDO product) {
        productService.updateProduct(product);
        return CommonResult.success(true);
    }

    @DeleteMapping("/{id}")
    public CommonResult<Boolean> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<ProductDO> getProduct(@PathVariable Long id) {
        ProductDO product = productService.getProduct(id);
        return CommonResult.success(product);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<ProductDO>> getProductPage(@Valid PageParam pageParam,
                                                               @RequestParam(required = false) String name,
                                                               @RequestParam(required = false) String barcode,
                                                               @RequestParam(required = false) Long categoryId,
                                                               @RequestParam(required = false) Integer status) {
        PageResult<ProductDO> page = productService.getProductPage(pageParam, name, barcode, categoryId, status);
        return CommonResult.success(page);
    }

    @Data
    public static class CreateProductRequest {
        private String name;
        private String barcode;
        private Long categoryId;
        private Long supplierId;
        private String spec;
        private String unit;
        private Integer shelfLife;
        private String imageUrl;
        private Integer status;
        private String remark;
        private BigDecimal costPrice;
        private BigDecimal retailPrice;
        private BigDecimal vipPrice;
    }
}
