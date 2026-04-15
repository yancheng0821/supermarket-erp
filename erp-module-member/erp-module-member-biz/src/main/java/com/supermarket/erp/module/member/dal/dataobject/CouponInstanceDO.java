package com.supermarket.erp.module.member.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("mbr_coupon_instance")
public class CouponInstanceDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long couponId;
    private Long memberId;
    private Integer status;
    private LocalDateTime useTime;
    private Long useOrderId;
    private LocalDateTime expireTime;
}
