package com.supermarket.erp.module.system.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.BaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_tenant")
public class TenantDO extends BaseDO {

    @TableId
    private Long id;
    private String name;
    private String contactName;
    private String contactPhone;
    private Integer status;
    private LocalDateTime expireDate;
}
