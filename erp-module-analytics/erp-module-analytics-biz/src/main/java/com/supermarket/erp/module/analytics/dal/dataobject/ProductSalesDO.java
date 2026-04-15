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
@TableName("rpt_product_sales")
public class ProductSalesDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long storeId;
    private Long productId;
    private LocalDate reportDate;
    private BigDecimal salesQuantity;
    private BigDecimal salesAmount;
    private BigDecimal costAmount;
    private BigDecimal profitAmount;
}
