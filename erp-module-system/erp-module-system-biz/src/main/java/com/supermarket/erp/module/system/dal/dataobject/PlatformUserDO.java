package com.supermarket.erp.module.system.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.BaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_platform_user")
public class PlatformUserDO extends BaseDO {

    @TableId
    private Long id;
    private String username;
    private String password;
    private String nickname;
    private Integer status;
}
