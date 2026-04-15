package com.supermarket.erp.module.finance.service.settlement;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.finance.dal.dataobject.SupplierSettlementDO;
import com.supermarket.erp.module.finance.dal.mysql.SupplierSettlementMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SupplierSettlementService {

    private static final ErrorCode SETTLEMENT_NOT_FOUND = new ErrorCode(700001, "Supplier settlement not found");

    private final SupplierSettlementMapper supplierSettlementMapper;

    private String generateSettlementNo() {
        return "SS" + System.currentTimeMillis();
    }

    public Long createSettlement(SupplierSettlementDO settlement) {
        settlement.setSettlementNo(generateSettlementNo());
        settlement.setStatus(0); // draft
        supplierSettlementMapper.insert(settlement);
        return settlement.getId();
    }

    public void updateSettlement(SupplierSettlementDO settlement) {
        validateExists(settlement.getId());
        supplierSettlementMapper.updateById(settlement);
    }

    public SupplierSettlementDO getSettlement(Long id) {
        return supplierSettlementMapper.selectById(id);
    }

    public void confirmSettlement(Long id) {
        SupplierSettlementDO settlement = validateExists(id);
        if (settlement.getStatus() != 0) {
            throw new ServiceException(700002, "Only draft settlements can be confirmed");
        }
        settlement.setStatus(1); // confirmed
        supplierSettlementMapper.updateById(settlement);
    }

    public void paySettlement(Long id) {
        SupplierSettlementDO settlement = validateExists(id);
        if (settlement.getStatus() != 1) {
            throw new ServiceException(700003, "Only confirmed settlements can be paid");
        }
        settlement.setStatus(2); // paid
        settlement.setPaidAmount(settlement.getTotalAmount());
        supplierSettlementMapper.updateById(settlement);
    }

    public PageResult<SupplierSettlementDO> getSettlementPage(PageParam pageParam, Long supplierId, Integer status) {
        LambdaQueryWrapper<SupplierSettlementDO> query = new LambdaQueryWrapper<SupplierSettlementDO>()
                .eq(supplierId != null, SupplierSettlementDO::getSupplierId, supplierId)
                .eq(status != null, SupplierSettlementDO::getStatus, status)
                .orderByDesc(SupplierSettlementDO::getId);
        return supplierSettlementMapper.selectPage(pageParam, query);
    }

    private SupplierSettlementDO validateExists(Long id) {
        SupplierSettlementDO settlement = supplierSettlementMapper.selectById(id);
        if (settlement == null) {
            throw new ServiceException(SETTLEMENT_NOT_FOUND);
        }
        return settlement;
    }
}
