package com.supermarket.erp.module.system.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.BaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_menu")
public class MenuDO extends BaseDO {

    @TableId
    private Long id;
    private String scope;
    private String name;
    private String permission;
    private Integer type;
    private Long parentId;
    private String path;
    private String component;
    private String icon;
    private Integer sort;
    private Integer status;
}
