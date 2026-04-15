package com.supermarket.erp.module.online.dal.mysql;

import com.supermarket.erp.framework.mybatis.core.BaseMapperX;
import com.supermarket.erp.module.online.dal.dataobject.DeliveryOrderDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DeliveryOrderMapper extends BaseMapperX<DeliveryOrderDO> {
}
