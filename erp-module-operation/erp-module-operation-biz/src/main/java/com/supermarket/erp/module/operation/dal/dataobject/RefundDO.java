package com.supermarket.erp.module.operation.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("opr_refund")
public class RefundDO extends TenantBaseDO {

    @TableId
    private Long id;
    private String refundNo;
    private Long orderId;
    private BigDecimal refundAmount;
    private String reason;
    private Integer status;
}
