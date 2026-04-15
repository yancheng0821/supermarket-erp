package com.supermarket.erp.module.archive.controller.admin.supplier;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.archive.dal.dataobject.SupplierDO;
import com.supermarket.erp.module.archive.service.supplier.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/archive/supplier")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @PostMapping
    public CommonResult<Long> createSupplier(@RequestBody SupplierDO supplier) {
        Long id = supplierService.createSupplier(supplier);
        return CommonResult.success(id);
    }

    @PutMapping
    public CommonResult<Boolean> updateSupplier(@RequestBody SupplierDO supplier) {
        supplierService.updateSupplier(supplier);
        return CommonResult.success(true);
    }

    @DeleteMapping("/{id}")
    public CommonResult<Boolean> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<SupplierDO> getSupplier(@PathVariable Long id) {
        SupplierDO supplier = supplierService.getSupplier(id);
        return CommonResult.success(supplier);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<SupplierDO>> getSupplierPage(@Valid PageParam pageParam,
                                                                 @RequestParam(required = false) String name,
                                                                 @RequestParam(required = false) Integer status) {
        PageResult<SupplierDO> page = supplierService.getSupplierPage(pageParam, name, status);
        return CommonResult.success(page);
    }
}
