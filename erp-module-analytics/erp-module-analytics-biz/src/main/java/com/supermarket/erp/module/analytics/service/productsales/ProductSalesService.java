package com.supermarket.erp.module.analytics.service.productsales;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.analytics.dal.dataobject.ProductSalesDO;
import com.supermarket.erp.module.analytics.dal.mysql.ProductSalesMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductSalesService {

    private final ProductSalesMapper productSalesMapper;

    public PageResult<ProductSalesDO> getProductSalesPage(PageParam pageParam, Long storeId, Long productId,
                                                           LocalDate startDate, LocalDate endDate) {
        LambdaQueryWrapper<ProductSalesDO> query = new LambdaQueryWrapper<ProductSalesDO>()
                .eq(storeId != null, ProductSalesDO::getStoreId, storeId)
                .eq(productId != null, ProductSalesDO::getProductId, productId)
                .ge(startDate != null, ProductSalesDO::getReportDate, startDate)
                .le(endDate != null, ProductSalesDO::getReportDate, endDate)
                .orderByDesc(ProductSalesDO::getReportDate);
        return productSalesMapper.selectPage(pageParam, query);
    }

    public List<ProductSalesDO> getTopProducts(Long storeId, LocalDate date, Integer limit) {
        LambdaQueryWrapper<ProductSalesDO> query = new LambdaQueryWrapper<ProductSalesDO>()
                .eq(ProductSalesDO::getStoreId, storeId)
                .eq(ProductSalesDO::getReportDate, date)
                .orderByDesc(ProductSalesDO::getSalesAmount)
                .last("LIMIT " + limit);
        return productSalesMapper.selectList(query);
    }
}
