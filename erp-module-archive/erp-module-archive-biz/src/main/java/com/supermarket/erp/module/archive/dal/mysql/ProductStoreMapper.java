package com.supermarket.erp.module.archive.dal.mysql;

import com.supermarket.erp.framework.mybatis.core.BaseMapperX;
import com.supermarket.erp.module.archive.dal.dataobject.ProductStoreDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProductStoreMapper extends BaseMapperX<ProductStoreDO> {
}
