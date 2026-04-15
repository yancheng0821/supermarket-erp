package com.supermarket.erp.module.operation.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("opr_sales_order_item")
public class SalesOrderItemDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long orderId;
    private Long productId;
    private String productName;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private BigDecimal discountAmount;
    private BigDecimal amount;
}
