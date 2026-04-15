package com.supermarket.erp.module.analytics.controller.admin.inventorysnapshot;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.analytics.dal.dataobject.InventorySnapshotDO;
import com.supermarket.erp.module.analytics.service.inventorysnapshot.InventorySnapshotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/admin/analytics/inventory-snapshot")
@RequiredArgsConstructor
public class InventorySnapshotController {

    private final InventorySnapshotService inventorySnapshotService;

    @GetMapping("/page")
    public CommonResult<PageResult<InventorySnapshotDO>> getSnapshotPage(@Valid PageParam pageParam,
                                                                          @RequestParam(required = false) Integer locationType,
                                                                          @RequestParam(required = false) Long locationId,
                                                                          @RequestParam(required = false) Long productId,
                                                                          @RequestParam(required = false) String date) {
        LocalDate snapshotDate = date != null ? LocalDate.parse(date) : null;
        PageResult<InventorySnapshotDO> page = inventorySnapshotService.getSnapshotPage(pageParam, locationType, locationId, productId, snapshotDate);
        return CommonResult.success(page);
    }
}
