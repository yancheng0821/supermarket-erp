package com.supermarket.erp.module.finance.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("fin_store_settlement")
public class StoreSettlementDO extends TenantBaseDO {

    @TableId
    private Long id;
    private String settlementNo;
    private Long storeId;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private BigDecimal salesAmount;
    private BigDecimal commissionAmount;
    private BigDecimal netAmount;
    private Integer status;
    private String remark;
}
