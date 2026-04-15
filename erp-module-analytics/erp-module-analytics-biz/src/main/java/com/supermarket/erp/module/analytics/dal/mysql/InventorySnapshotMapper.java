package com.supermarket.erp.module.analytics.dal.mysql;

import com.supermarket.erp.framework.mybatis.core.BaseMapperX;
import com.supermarket.erp.module.analytics.dal.dataobject.InventorySnapshotDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface InventorySnapshotMapper extends BaseMapperX<InventorySnapshotDO> {
}
