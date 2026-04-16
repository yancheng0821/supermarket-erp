package com.supermarket.erp.module.system.dal.mysql;

import com.supermarket.erp.framework.mybatis.core.BaseMapperX;
import com.supermarket.erp.module.system.dal.dataobject.TenantDO;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TenantMapper extends BaseMapperX<TenantDO> {

    @Select("SELECT * FROM sys_tenant WHERE code = #{code} AND deleted = 0 LIMIT 1")
    TenantDO selectByCode(String code);
}
