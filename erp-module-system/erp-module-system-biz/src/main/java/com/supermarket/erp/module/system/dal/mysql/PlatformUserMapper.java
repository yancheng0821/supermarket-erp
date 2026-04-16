package com.supermarket.erp.module.system.dal.mysql;

import com.supermarket.erp.framework.mybatis.core.BaseMapperX;
import com.supermarket.erp.module.system.dal.dataobject.PlatformUserDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface PlatformUserMapper extends BaseMapperX<PlatformUserDO> {

    @Select("SELECT * FROM sys_platform_user WHERE username = #{username} AND deleted = 0 LIMIT 1")
    PlatformUserDO selectByUsername(String username);
}
