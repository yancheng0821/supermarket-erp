package com.supermarket.erp.module.archive.service.product;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.archive.dal.dataobject.ProductDO;
import com.supermarket.erp.module.archive.dal.dataobject.ProductPriceDO;
import com.supermarket.erp.module.archive.dal.mysql.ProductMapper;
import com.supermarket.erp.module.archive.dal.mysql.ProductPriceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private static final ErrorCode PRODUCT_NOT_FOUND = new ErrorCode(100401, "Product not found");

    private final ProductMapper productMapper;
    private final ProductPriceMapper productPriceMapper;

    @Transactional
    public Long createProduct(ProductDO product, ProductPriceDO price) {
        productMapper.insert(product);
        if (price != null) {
            price.setProductId(product.getId());
            productPriceMapper.insert(price);
        }
        return product.getId();
    }

    public void updateProduct(ProductDO product) {
        validateProductExists(product.getId());
        productMapper.updateById(product);
    }

    public void deleteProduct(Long id) {
        validateProductExists(id);
        productMapper.deleteById(id);
    }

    public ProductDO getProduct(Long id) {
        return productMapper.selectById(id);
    }

    public PageResult<ProductDO> getProductPage(PageParam pageParam, String name, String barcode,
                                                 Long categoryId, Integer status) {
        LambdaQueryWrapper<ProductDO> query = new LambdaQueryWrapper<ProductDO>()
                .like(name != null, ProductDO::getName, name)
                .eq(barcode != null, ProductDO::getBarcode, barcode)
                .eq(categoryId != null, ProductDO::getCategoryId, categoryId)
                .eq(status != null, ProductDO::getStatus, status)
                .orderByDesc(ProductDO::getId);
        return productMapper.selectPage(pageParam, query);
    }

    private void validateProductExists(Long id) {
        if (productMapper.selectById(id) == null) {
            throw new ServiceException(PRODUCT_NOT_FOUND);
        }
    }
}
