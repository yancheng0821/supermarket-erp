package com.supermarket.erp.module.finance.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("fin_voucher")
public class VoucherDO extends TenantBaseDO {

    @TableId
    private Long id;
    private String voucherNo;
    private String bizType;
    private Long bizId;
    private String debitAccount;
    private String creditAccount;
    private BigDecimal amount;
    private String period;
    private Integer status;
    private String remark;
}
