package com.supermarket.erp.module.archive.api.product;

import com.supermarket.erp.module.archive.api.product.dto.ProductDTO;

import java.util.List;

public interface ProductApi {

    ProductDTO getProduct(Long id);

    List<ProductDTO> getProductsByIds(List<Long> ids);
}
