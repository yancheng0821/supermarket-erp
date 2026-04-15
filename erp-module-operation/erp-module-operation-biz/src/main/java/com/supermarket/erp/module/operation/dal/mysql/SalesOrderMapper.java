package com.supermarket.erp.module.operation.dal.mysql;

import com.supermarket.erp.framework.mybatis.core.BaseMapperX;
import com.supermarket.erp.module.operation.dal.dataobject.SalesOrderDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SalesOrderMapper extends BaseMapperX<SalesOrderDO> {
}
