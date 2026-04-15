package com.supermarket.erp.module.online.dal.mysql;

import com.supermarket.erp.framework.mybatis.core.BaseMapperX;
import com.supermarket.erp.module.online.dal.dataobject.OnlineProductDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OnlineProductMapper extends BaseMapperX<OnlineProductDO> {
}
