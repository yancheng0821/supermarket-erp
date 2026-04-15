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
@TableName("rpt_inventory_snapshot")
public class InventorySnapshotDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Integer locationType;
    private Long locationId;
    private Long productId;
    private LocalDate snapshotDate;
    private BigDecimal quantity;
    private BigDecimal costAmount;
}
