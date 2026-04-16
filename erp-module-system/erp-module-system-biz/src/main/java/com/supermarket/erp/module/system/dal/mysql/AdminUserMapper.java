package com.supermarket.erp.module.system.dal.mysql;

import com.supermarket.erp.framework.mybatis.core.BaseMapperX;
import com.supermarket.erp.module.system.dal.dataobject.AdminUserDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AdminUserMapper extends BaseMapperX<AdminUserDO> {

    @Select("SELECT * FROM sys_user WHERE username = #{username} AND deleted = 0 LIMIT 1")
    AdminUserDO selectByUsername(String username);

    @Select("SELECT * FROM sys_user WHERE tenant_id = #{tenantId} AND username = #{username} AND deleted = 0 LIMIT 1")
    AdminUserDO selectByTenantIdAndUsername(@Param("tenantId") Long tenantId, @Param("username") String username);
}
