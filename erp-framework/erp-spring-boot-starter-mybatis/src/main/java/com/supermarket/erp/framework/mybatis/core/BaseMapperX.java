package com.supermarket.erp.framework.mybatis.core;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;

public interface BaseMapperX<T> extends BaseMapper<T> {

    default PageResult<T> selectPage(PageParam pageParam, LambdaQueryWrapper<T> queryWrapper) {
        IPage<T> page = selectPage(new Page<>(pageParam.getPageNo(), pageParam.getPageSize()), queryWrapper);
        return new PageResult<>(page.getRecords(), page.getTotal());
    }
}
