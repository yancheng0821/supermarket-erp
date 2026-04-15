package com.supermarket.erp.module.finance.dal.mysql;

import com.supermarket.erp.framework.mybatis.core.BaseMapperX;
import com.supermarket.erp.module.finance.dal.dataobject.VoucherDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface VoucherMapper extends BaseMapperX<VoucherDO> {
}
