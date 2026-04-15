package com.supermarket.erp.module.archive.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("arc_store")
public class StoreDO extends TenantBaseDO {

    @TableId
    private Long id;
    private String name;
    private String code;
    private Integer type;
    private String address;
    private String contactName;
    private String contactPhone;
    private Integer status;
}
