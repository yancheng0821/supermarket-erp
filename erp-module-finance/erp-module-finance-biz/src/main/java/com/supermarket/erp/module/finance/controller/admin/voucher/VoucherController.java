package com.supermarket.erp.module.finance.controller.admin.voucher;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.finance.dal.dataobject.VoucherDO;
import com.supermarket.erp.module.finance.service.voucher.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/finance/voucher")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @PostMapping
    public CommonResult<Long> createVoucher(@RequestBody VoucherDO voucher) {
        Long id = voucherService.createVoucher(voucher);
        return CommonResult.success(id);
    }

    @PostMapping("/{id}/post")
    public CommonResult<Boolean> postVoucher(@PathVariable Long id) {
        voucherService.postVoucher(id);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<VoucherDO> getVoucher(@PathVariable Long id) {
        VoucherDO voucher = voucherService.getVoucher(id);
        return CommonResult.success(voucher);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<VoucherDO>> getVoucherPage(@Valid PageParam pageParam,
                                                               @RequestParam(required = false) String bizType,
                                                               @RequestParam(required = false) String period,
                                                               @RequestParam(required = false) Integer status) {
        PageResult<VoucherDO> page = voucherService.getVoucherPage(pageParam, bizType, period, status);
        return CommonResult.success(page);
    }
}
