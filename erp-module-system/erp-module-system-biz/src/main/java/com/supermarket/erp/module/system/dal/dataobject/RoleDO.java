package com.supermarket.erp.module.system.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_role")
public class RoleDO extends TenantBaseDO {

    @TableId
    private Long id;
    private String name;
    private String code;
    private Integer sort;
    private Integer status;
    private String remark;
}
