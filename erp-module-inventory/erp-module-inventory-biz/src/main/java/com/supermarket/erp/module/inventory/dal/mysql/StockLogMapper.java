package com.supermarket.erp.module.inventory.dal.mysql;

import com.supermarket.erp.framework.mybatis.core.BaseMapperX;
import com.supermarket.erp.module.inventory.dal.dataobject.StockLogDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StockLogMapper extends BaseMapperX<StockLogDO> {
}
