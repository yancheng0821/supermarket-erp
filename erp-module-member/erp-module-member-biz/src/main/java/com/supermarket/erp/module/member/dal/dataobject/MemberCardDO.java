package com.supermarket.erp.module.member.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("mbr_member_card")
public class MemberCardDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long memberId;
    private String cardNo;
    private Integer level;
    private BigDecimal balance;
    private Integer points;
    private BigDecimal totalSpend;
    private Integer status;
}
