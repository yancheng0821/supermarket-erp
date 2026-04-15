package com.supermarket.erp.module.purchase.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("pur_purchase_order")
public class PurchaseOrderDO extends TenantBaseDO {

    @TableId
    private Long id;
    private String orderNo;
    private Integer type;
    private Long supplierId;
    private Long storeId;
    private Long warehouseId;
    private BigDecimal totalAmount;
    private Integer status;
    private String remark;
}
