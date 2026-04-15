package com.supermarket.erp.module.purchase.dal.mysql;

import com.supermarket.erp.framework.mybatis.core.BaseMapperX;
import com.supermarket.erp.module.purchase.dal.dataobject.PurchaseOrderDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PurchaseOrderMapper extends BaseMapperX<PurchaseOrderDO> {
}
