package com.supermarket.erp.module.operation.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("opr_payment")
public class PaymentDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long orderId;
    private String paymentNo;
    private Integer method;
    private BigDecimal amount;
    private Integer status;
    private String thirdPartyNo;
    private String remark;
}
