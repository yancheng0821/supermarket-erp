package com.supermarket.erp.module.inventory.dal.mysql;

import com.supermarket.erp.framework.mybatis.core.BaseMapperX;
import com.supermarket.erp.module.inventory.dal.dataobject.CheckOrderDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CheckOrderMapper extends BaseMapperX<CheckOrderDO> {
}
