package com.supermarket.erp.module.inventory.dal.mysql;

import com.supermarket.erp.framework.mybatis.core.BaseMapperX;
import com.supermarket.erp.module.inventory.dal.dataobject.CheckOrderItemDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CheckOrderItemMapper extends BaseMapperX<CheckOrderItemDO> {
}
