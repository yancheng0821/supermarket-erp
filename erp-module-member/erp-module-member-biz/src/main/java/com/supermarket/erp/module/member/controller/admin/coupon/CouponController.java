package com.supermarket.erp.module.member.controller.admin.coupon;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.member.dal.dataobject.CouponDO;
import com.supermarket.erp.module.member.dal.dataobject.CouponInstanceDO;
import com.supermarket.erp.module.member.service.coupon.CouponService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/member/coupon")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @PostMapping
    public CommonResult<Long> createCoupon(@RequestBody CouponDO coupon) {
        Long id = couponService.createCoupon(coupon);
        return CommonResult.success(id);
    }

    @PutMapping
    public CommonResult<Boolean> updateCoupon(@RequestBody CouponDO coupon) {
        couponService.updateCoupon(coupon);
        return CommonResult.success(true);
    }

    @PostMapping("/issue")
    public CommonResult<Long> issueCoupon(@RequestBody IssueRequest request) {
        Long instanceId = couponService.issueCoupon(request.getCouponId(), request.getMemberId());
        return CommonResult.success(instanceId);
    }

    @PostMapping("/{instanceId}/use")
    public CommonResult<Boolean> useCoupon(@PathVariable Long instanceId,
                                            @RequestParam Long orderId) {
        couponService.useCoupon(instanceId, orderId);
        return CommonResult.success(true);
    }

    @GetMapping("/member/{memberId}")
    public CommonResult<List<CouponInstanceDO>> getMemberCoupons(@PathVariable Long memberId,
                                                                  @RequestParam(required = false) Integer status) {
        List<CouponInstanceDO> coupons = couponService.getMemberCoupons(memberId, status);
        return CommonResult.success(coupons);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<CouponDO>> getCouponPage(@Valid PageParam pageParam,
                                                             @RequestParam(required = false) Integer type,
                                                             @RequestParam(required = false) Integer status) {
        PageResult<CouponDO> page = couponService.getCouponPage(pageParam, type, status);
        return CommonResult.success(page);
    }

    @Data
    public static class IssueRequest {
        private Long couponId;
        private Long memberId;
    }
}
