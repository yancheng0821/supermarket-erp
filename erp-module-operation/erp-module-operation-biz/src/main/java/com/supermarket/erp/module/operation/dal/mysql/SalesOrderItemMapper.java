package com.supermarket.erp.module.operation.dal.mysql;

import com.supermarket.erp.framework.mybatis.core.BaseMapperX;
import com.supermarket.erp.module.operation.dal.dataobject.SalesOrderItemDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SalesOrderItemMapper extends BaseMapperX<SalesOrderItemDO> {
}
