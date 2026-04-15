package com.supermarket.erp.module.analytics.service.dailysales;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.analytics.dal.dataobject.DailySalesDO;
import com.supermarket.erp.module.analytics.dal.mysql.DailySalesMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailySalesService {

    private final DailySalesMapper dailySalesMapper;

    public DailySalesDO getDailySales(Long storeId, LocalDate date) {
        LambdaQueryWrapper<DailySalesDO> query = new LambdaQueryWrapper<DailySalesDO>()
                .eq(DailySalesDO::getStoreId, storeId)
                .eq(DailySalesDO::getReportDate, date);
        return dailySalesMapper.selectOne(query);
    }

    public List<DailySalesDO> getDailySalesRange(Long storeId, LocalDate startDate, LocalDate endDate) {
        LambdaQueryWrapper<DailySalesDO> query = new LambdaQueryWrapper<DailySalesDO>()
                .eq(DailySalesDO::getStoreId, storeId)
                .between(DailySalesDO::getReportDate, startDate, endDate)
                .orderByAsc(DailySalesDO::getReportDate);
        return dailySalesMapper.selectList(query);
    }

    public PageResult<DailySalesDO> getDailySalesPage(PageParam pageParam, Long storeId,
                                                       LocalDate startDate, LocalDate endDate) {
        LambdaQueryWrapper<DailySalesDO> query = new LambdaQueryWrapper<DailySalesDO>()
                .eq(storeId != null, DailySalesDO::getStoreId, storeId)
                .ge(startDate != null, DailySalesDO::getReportDate, startDate)
                .le(endDate != null, DailySalesDO::getReportDate, endDate)
                .orderByDesc(DailySalesDO::getReportDate);
        return dailySalesMapper.selectPage(pageParam, query);
    }
}
