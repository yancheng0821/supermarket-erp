package com.supermarket.erp.module.archive.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("arc_product_price")
public class ProductPriceDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long productId;
    private Long storeId;
    private BigDecimal costPrice;
    private BigDecimal retailPrice;
    private BigDecimal vipPrice;
}
