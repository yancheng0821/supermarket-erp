package com.supermarket.erp.module.operation.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("opr_sales_order")
public class SalesOrderDO extends TenantBaseDO {

    @TableId
    private Long id;
    private String orderNo;
    private Integer channel;
    private Long storeId;
    private Long memberId;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal payAmount;
    private Integer itemCount;
    private Integer status;
    private String remark;
}
