package com.supermarket.erp.module.purchase.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("pur_purchase_order_item")
public class PurchaseOrderItemDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long orderId;
    private Long productId;
    private BigDecimal quantity;
    private BigDecimal receivedQuantity;
    private BigDecimal costPrice;
    private BigDecimal amount;
    private String remark;
}
