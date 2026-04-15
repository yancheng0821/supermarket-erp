package com.supermarket.erp.module.member.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("mbr_balance_log")
public class BalanceLogDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long memberId;
    private Long cardId;
    private Integer type;
    private BigDecimal amount;
    private BigDecimal balanceBefore;
    private BigDecimal balanceAfter;
    private String bizType;
    private Long bizId;
    private String remark;
}
