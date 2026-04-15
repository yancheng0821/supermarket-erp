package com.supermarket.erp.module.inventory.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("inv_stock")
public class StockDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long productId;
    private Integer locationType;
    private Long locationId;
    private BigDecimal quantity;
    private BigDecimal costAmount;
}
