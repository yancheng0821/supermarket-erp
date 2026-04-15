package com.supermarket.erp.module.finance.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("fin_fee_record")
public class FeeRecordDO extends TenantBaseDO {

    @TableId
    private Long id;
    private String feeNo;
    private Integer type;
    private Integer targetType;
    private Long targetId;
    private BigDecimal amount;
    private Integer status;
    private String remark;
}
