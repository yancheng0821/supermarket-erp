package com.supermarket.erp.module.finance.dal.mysql;

import com.supermarket.erp.framework.mybatis.core.BaseMapperX;
import com.supermarket.erp.module.finance.dal.dataobject.FeeRecordDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FeeRecordMapper extends BaseMapperX<FeeRecordDO> {
}
