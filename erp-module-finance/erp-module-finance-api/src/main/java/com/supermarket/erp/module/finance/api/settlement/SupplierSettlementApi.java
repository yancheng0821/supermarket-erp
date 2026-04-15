package com.supermarket.erp.module.finance.api.settlement;

import com.supermarket.erp.module.finance.api.settlement.dto.SupplierSettlementDTO;

public interface SupplierSettlementApi {

    SupplierSettlementDTO getSettlement(Long id);
}
