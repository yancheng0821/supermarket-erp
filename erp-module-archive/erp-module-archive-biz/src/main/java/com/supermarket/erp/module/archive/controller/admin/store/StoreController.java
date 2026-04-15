package com.supermarket.erp.module.archive.controller.admin.store;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.archive.dal.dataobject.StoreDO;
import com.supermarket.erp.module.archive.service.store.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/archive/store")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @PostMapping
    public CommonResult<Long> createStore(@RequestBody StoreDO store) {
        Long id = storeService.createStore(store);
        return CommonResult.success(id);
    }

    @PutMapping
    public CommonResult<Boolean> updateStore(@RequestBody StoreDO store) {
        storeService.updateStore(store);
        return CommonResult.success(true);
    }

    @DeleteMapping("/{id}")
    public CommonResult<Boolean> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<StoreDO> getStore(@PathVariable Long id) {
        StoreDO store = storeService.getStore(id);
        return CommonResult.success(store);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<StoreDO>> getStorePage(@Valid PageParam pageParam,
                                                          @RequestParam(required = false) String name,
                                                          @RequestParam(required = false) Integer status) {
        PageResult<StoreDO> page = storeService.getStorePage(pageParam, name, status);
        return CommonResult.success(page);
    }
}
