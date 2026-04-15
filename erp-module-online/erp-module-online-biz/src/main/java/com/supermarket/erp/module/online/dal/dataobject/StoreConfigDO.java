package com.supermarket.erp.module.online.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("onl_store_config")
public class StoreConfigDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long storeId;
    private Boolean onlineEnabled;
    private String openTime;
    private String closeTime;
    private Boolean deliveryEnabled;
    private Boolean pickupEnabled;
    private BigDecimal deliveryRadius;
    private BigDecimal minOrderAmount;
    private BigDecimal deliveryFee;
}
