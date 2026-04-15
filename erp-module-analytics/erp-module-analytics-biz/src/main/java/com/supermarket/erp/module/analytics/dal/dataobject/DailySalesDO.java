package com.supermarket.erp.module.analytics.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("rpt_daily_sales")
public class DailySalesDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long storeId;
    private LocalDate reportDate;
    private BigDecimal salesAmount;
    private BigDecimal costAmount;
    private BigDecimal profitAmount;
    private Integer orderCount;
    private Integer customerCount;
    private BigDecimal avgOrderAmount;
}
