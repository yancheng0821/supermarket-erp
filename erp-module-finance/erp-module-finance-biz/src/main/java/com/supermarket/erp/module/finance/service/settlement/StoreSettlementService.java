package com.supermarket.erp.module.finance.service.settlement;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.finance.dal.dataobject.StoreSettlementDO;
import com.supermarket.erp.module.finance.dal.mysql.StoreSettlementMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StoreSettlementService {

    private static final ErrorCode SETTLEMENT_NOT_FOUND = new ErrorCode(700011, "Store settlement not found");

    private final StoreSettlementMapper storeSettlementMapper;

    private String generateSettlementNo() {
        return "STS" + System.currentTimeMillis();
    }

    public Long createSettlement(StoreSettlementDO settlement) {
        settlement.setSettlementNo(generateSettlementNo());
        settlement.setStatus(0); // draft
        storeSettlementMapper.insert(settlement);
        return settlement.getId();
    }

    public void updateSettlement(StoreSettlementDO settlement) {
        validateExists(settlement.getId());
        storeSettlementMapper.updateById(settlement);
    }

    public StoreSettlementDO getSettlement(Long id) {
        return storeSettlementMapper.selectById(id);
    }

    public void confirmSettlement(Long id) {
        StoreSettlementDO settlement = validateExists(id);
        if (settlement.getStatus() != 0) {
            throw new ServiceException(700012, "Only draft settlements can be confirmed");
        }
        settlement.setStatus(1); // confirmed
        storeSettlementMapper.updateById(settlement);
    }

    public void paySettlement(Long id) {
        StoreSettlementDO settlement = validateExists(id);
        if (settlement.getStatus() != 1) {
            throw new ServiceException(700013, "Only confirmed settlements can be paid");
        }
        settlement.setStatus(2); // paid
        storeSettlementMapper.updateById(settlement);
    }

    public PageResult<StoreSettlementDO> getSettlementPage(PageParam pageParam, Long storeId, Integer status) {
        LambdaQueryWrapper<StoreSettlementDO> query = new LambdaQueryWrapper<StoreSettlementDO>()
                .eq(storeId != null, StoreSettlementDO::getStoreId, storeId)
                .eq(status != null, StoreSettlementDO::getStatus, status)
                .orderByDesc(StoreSettlementDO::getId);
        return storeSettlementMapper.selectPage(pageParam, query);
    }

    private StoreSettlementDO validateExists(Long id) {
        StoreSettlementDO settlement = storeSettlementMapper.selectById(id);
        if (settlement == null) {
            throw new ServiceException(SETTLEMENT_NOT_FOUND);
        }
        return settlement;
    }
}
