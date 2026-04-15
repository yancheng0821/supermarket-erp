package com.supermarket.erp.module.archive.controller.admin.warehouse;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.archive.dal.dataobject.WarehouseDO;
import com.supermarket.erp.module.archive.service.warehouse.WarehouseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/archive/warehouse")
@RequiredArgsConstructor
public class WarehouseController {

    private final WarehouseService warehouseService;

    @PostMapping
    public CommonResult<Long> createWarehouse(@RequestBody WarehouseDO warehouse) {
        Long id = warehouseService.createWarehouse(warehouse);
        return CommonResult.success(id);
    }

    @PutMapping
    public CommonResult<Boolean> updateWarehouse(@RequestBody WarehouseDO warehouse) {
        warehouseService.updateWarehouse(warehouse);
        return CommonResult.success(true);
    }

    @DeleteMapping("/{id}")
    public CommonResult<Boolean> deleteWarehouse(@PathVariable Long id) {
        warehouseService.deleteWarehouse(id);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<WarehouseDO> getWarehouse(@PathVariable Long id) {
        WarehouseDO warehouse = warehouseService.getWarehouse(id);
        return CommonResult.success(warehouse);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<WarehouseDO>> getWarehousePage(@Valid PageParam pageParam,
                                                                   @RequestParam(required = false) String name,
                                                                   @RequestParam(required = false) Integer status) {
        PageResult<WarehouseDO> page = warehouseService.getWarehousePage(pageParam, name, status);
        return CommonResult.success(page);
    }
}
