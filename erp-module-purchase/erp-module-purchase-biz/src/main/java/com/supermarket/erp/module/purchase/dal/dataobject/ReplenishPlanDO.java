package com.supermarket.erp.module.purchase.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("pur_replenish_plan")
public class ReplenishPlanDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long storeId;
    private Long productId;
    private BigDecimal currentStock;
    private BigDecimal minStock;
    private BigDecimal suggestQuantity;
    private Integer status;
    private Long purchaseOrderId;
    private String remark;
}
