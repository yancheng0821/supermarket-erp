package com.supermarket.erp.module.operation.api.sales;

import com.supermarket.erp.module.operation.api.sales.dto.SalesOrderDTO;

public interface SalesOrderApi {

    SalesOrderDTO getOrder(Long id);
}
