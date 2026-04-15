package com.supermarket.erp.module.online.controller.admin;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.online.dal.dataobject.StoreConfigDO;
import com.supermarket.erp.module.online.service.config.StoreConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/online/store-config")
@RequiredArgsConstructor
public class StoreConfigController {

    private final StoreConfigService storeConfigService;

    @PostMapping
    public CommonResult<Long> saveConfig(@RequestBody StoreConfigDO config) {
        Long id = storeConfigService.saveConfig(config);
        return CommonResult.success(id);
    }

    @GetMapping("/{storeId}")
    public CommonResult<StoreConfigDO> getConfig(@PathVariable Long storeId) {
        StoreConfigDO config = storeConfigService.getConfig(storeId);
        return CommonResult.success(config);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<StoreConfigDO>> getConfigPage(@Valid PageParam pageParam,
                                                                   @RequestParam(required = false) Boolean onlineEnabled) {
        PageResult<StoreConfigDO> page = storeConfigService.getConfigPage(pageParam, onlineEnabled);
        return CommonResult.success(page);
    }
}
