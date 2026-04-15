package com.supermarket.erp.module.operation.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("opr_cashier_shift")
public class CashierShiftDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long storeId;
    private Long cashierId;
    private String cashierName;
    private String shiftNo;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal openingAmount;
    private BigDecimal closingAmount;
    private BigDecimal salesAmount;
    private Integer orderCount;
    private Integer status;
}
