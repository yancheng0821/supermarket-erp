package com.supermarket.erp.module.online.service.product;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.online.dal.dataobject.OnlineProductDO;
import com.supermarket.erp.module.online.dal.mysql.OnlineProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OnlineProductService {

    private static final ErrorCode PRODUCT_NOT_FOUND = new ErrorCode(600001, "Online product not found");

    private final OnlineProductMapper onlineProductMapper;

    public Long createProduct(OnlineProductDO product) {
        onlineProductMapper.insert(product);
        return product.getId();
    }

    public void updateProduct(OnlineProductDO product) {
        validateProductExists(product.getId());
        onlineProductMapper.updateById(product);
    }

    public void deleteProduct(Long id) {
        validateProductExists(id);
        onlineProductMapper.deleteById(id);
    }

    public OnlineProductDO getProduct(Long id) {
        return onlineProductMapper.selectById(id);
    }

    public List<OnlineProductDO> listByStore(Long storeId, Integer status) {
        LambdaQueryWrapper<OnlineProductDO> query = new LambdaQueryWrapper<OnlineProductDO>()
                .eq(OnlineProductDO::getStoreId, storeId)
                .eq(status != null, OnlineProductDO::getStatus, status)
                .orderByAsc(OnlineProductDO::getSort)
                .orderByAsc(OnlineProductDO::getId);
        return onlineProductMapper.selectList(query);
    }

    public PageResult<OnlineProductDO> getProductPage(PageParam pageParam, Long storeId,
                                                       Long productId, Integer status) {
        LambdaQueryWrapper<OnlineProductDO> query = new LambdaQueryWrapper<OnlineProductDO>()
                .eq(storeId != null, OnlineProductDO::getStoreId, storeId)
                .eq(productId != null, OnlineProductDO::getProductId, productId)
                .eq(status != null, OnlineProductDO::getStatus, status)
                .orderByAsc(OnlineProductDO::getSort);
        return onlineProductMapper.selectPage(pageParam, query);
    }

    private void validateProductExists(Long id) {
        if (onlineProductMapper.selectById(id) == null) {
            throw new ServiceException(PRODUCT_NOT_FOUND);
        }
    }
}
