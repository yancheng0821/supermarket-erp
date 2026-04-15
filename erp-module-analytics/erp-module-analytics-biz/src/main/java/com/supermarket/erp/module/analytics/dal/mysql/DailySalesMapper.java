package com.supermarket.erp.module.analytics.dal.mysql;

import com.supermarket.erp.framework.mybatis.core.BaseMapperX;
import com.supermarket.erp.module.analytics.dal.dataobject.DailySalesDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DailySalesMapper extends BaseMapperX<DailySalesDO> {
}
