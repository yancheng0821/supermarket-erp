package com.supermarket.erp.module.online.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("onl_shopping_cart")
public class ShoppingCartDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long memberId;
    private Long storeId;
    private Long productId;
    private BigDecimal quantity;
    private Boolean selected;
}
