package com.supermarket.erp.module.inventory.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("inv_check_order_item")
public class CheckOrderItemDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long orderId;
    private Long productId;
    private BigDecimal systemQuantity;
    private BigDecimal actualQuantity;
    private BigDecimal diffQuantity;
    private String remark;
}
