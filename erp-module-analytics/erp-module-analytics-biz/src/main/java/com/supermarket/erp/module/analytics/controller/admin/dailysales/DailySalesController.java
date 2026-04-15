package com.supermarket.erp.module.analytics.controller.admin.dailysales;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.analytics.dal.dataobject.DailySalesDO;
import com.supermarket.erp.module.analytics.service.dailysales.DailySalesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/analytics/daily-sales")
@RequiredArgsConstructor
public class DailySalesController {

    private final DailySalesService dailySalesService;

    @GetMapping("/{storeId}/{date}")
    public CommonResult<DailySalesDO> getDailySales(@PathVariable Long storeId,
                                                     @PathVariable String date) {
        LocalDate reportDate = LocalDate.parse(date);
        DailySalesDO result = dailySalesService.getDailySales(storeId, reportDate);
        return CommonResult.success(result);
    }

    @GetMapping("/{storeId}/range")
    public CommonResult<List<DailySalesDO>> getDailySalesRange(@PathVariable Long storeId,
                                                                @RequestParam String startDate,
                                                                @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        List<DailySalesDO> result = dailySalesService.getDailySalesRange(storeId, start, end);
        return CommonResult.success(result);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<DailySalesDO>> getDailySalesPage(@Valid PageParam pageParam,
                                                                     @RequestParam(required = false) Long storeId,
                                                                     @RequestParam(required = false) String startDate,
                                                                     @RequestParam(required = false) String endDate) {
        LocalDate start = startDate != null ? LocalDate.parse(startDate) : null;
        LocalDate end = endDate != null ? LocalDate.parse(endDate) : null;
        PageResult<DailySalesDO> page = dailySalesService.getDailySalesPage(pageParam, storeId, start, end);
        return CommonResult.success(page);
    }
}
