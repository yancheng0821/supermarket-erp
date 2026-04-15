package com.supermarket.erp.framework.mybatis.core;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public abstract class TenantBaseDO extends BaseDO {

    @TableField("tenant_id")
    private Long tenantId;
}
