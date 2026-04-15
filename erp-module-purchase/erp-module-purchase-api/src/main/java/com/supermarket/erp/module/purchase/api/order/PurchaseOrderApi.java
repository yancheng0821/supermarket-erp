package com.supermarket.erp.module.purchase.api.order;

import com.supermarket.erp.module.purchase.api.order.dto.PurchaseOrderDTO;

public interface PurchaseOrderApi {

    PurchaseOrderDTO getOrder(Long id);
}
