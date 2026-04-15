package com.supermarket.erp.module.member.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("mbr_coupon")
public class CouponDO extends TenantBaseDO {

    @TableId
    private Long id;
    private String name;
    private Integer type;
    private BigDecimal discountValue;
    private BigDecimal minSpend;
    private Long categoryId;
    private Integer totalCount;
    private Integer usedCount;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer status;
}
