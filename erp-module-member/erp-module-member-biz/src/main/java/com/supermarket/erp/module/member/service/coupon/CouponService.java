package com.supermarket.erp.module.member.service.coupon;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.member.dal.dataobject.CouponDO;
import com.supermarket.erp.module.member.dal.dataobject.CouponInstanceDO;
import com.supermarket.erp.module.member.dal.mysql.CouponInstanceMapper;
import com.supermarket.erp.module.member.dal.mysql.CouponMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponService {

    private static final ErrorCode COUPON_NOT_FOUND = new ErrorCode(500301, "Coupon not found");
    private static final ErrorCode COUPON_ALREADY_CLAIMED = new ErrorCode(500302, "Coupon already claimed");
    private static final ErrorCode COUPON_NOT_AVAILABLE = new ErrorCode(500303, "Coupon not available");

    private final CouponMapper couponMapper;
    private final CouponInstanceMapper couponInstanceMapper;

    public Long createCoupon(CouponDO coupon) {
        coupon.setUsedCount(0);
        couponMapper.insert(coupon);
        return coupon.getId();
    }

    public void updateCoupon(CouponDO coupon) {
        validateCouponExists(coupon.getId());
        couponMapper.updateById(coupon);
    }

    public Long issueCoupon(Long couponId, Long memberId) {
        // Get coupon and check availability
        CouponDO coupon = couponMapper.selectById(couponId);
        if (coupon == null) {
            throw new ServiceException(COUPON_NOT_FOUND);
        }
        if (coupon.getStatus() != 0 || coupon.getTotalCount() <= coupon.getUsedCount()) {
            throw new ServiceException(COUPON_NOT_AVAILABLE);
        }

        // Check if member already has an unused instance of this coupon
        CouponInstanceDO existing = couponInstanceMapper.selectOne(new LambdaQueryWrapper<CouponInstanceDO>()
                .eq(CouponInstanceDO::getCouponId, couponId)
                .eq(CouponInstanceDO::getMemberId, memberId)
                .eq(CouponInstanceDO::getStatus, 0));
        if (existing != null) {
            throw new ServiceException(COUPON_ALREADY_CLAIMED);
        }

        // Create coupon instance
        CouponInstanceDO instance = new CouponInstanceDO();
        instance.setCouponId(couponId);
        instance.setMemberId(memberId);
        instance.setStatus(0); // unused
        instance.setExpireTime(coupon.getEndTime());
        couponInstanceMapper.insert(instance);

        // Update issued count
        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponMapper.updateById(coupon);

        return instance.getId();
    }

    public void useCoupon(Long instanceId, Long orderId) {
        CouponInstanceDO instance = couponInstanceMapper.selectById(instanceId);
        if (instance == null || instance.getStatus() != 0) {
            throw new ServiceException(COUPON_NOT_AVAILABLE);
        }

        instance.setStatus(1); // used
        instance.setUseTime(LocalDateTime.now());
        instance.setUseOrderId(orderId);
        couponInstanceMapper.updateById(instance);
    }

    public List<CouponInstanceDO> getMemberCoupons(Long memberId, Integer status) {
        LambdaQueryWrapper<CouponInstanceDO> query = new LambdaQueryWrapper<CouponInstanceDO>()
                .eq(CouponInstanceDO::getMemberId, memberId)
                .eq(status != null, CouponInstanceDO::getStatus, status)
                .orderByDesc(CouponInstanceDO::getId);
        return couponInstanceMapper.selectList(query);
    }

    public PageResult<CouponDO> getCouponPage(PageParam pageParam, Integer type, Integer status) {
        LambdaQueryWrapper<CouponDO> query = new LambdaQueryWrapper<CouponDO>()
                .eq(type != null, CouponDO::getType, type)
                .eq(status != null, CouponDO::getStatus, status)
                .orderByDesc(CouponDO::getId);
        return couponMapper.selectPage(pageParam, query);
    }

    private void validateCouponExists(Long id) {
        if (couponMapper.selectById(id) == null) {
            throw new ServiceException(COUPON_NOT_FOUND);
        }
    }
}
