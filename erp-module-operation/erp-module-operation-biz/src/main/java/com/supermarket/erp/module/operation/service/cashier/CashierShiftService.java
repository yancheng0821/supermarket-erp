package com.supermarket.erp.module.operation.service.cashier;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.operation.dal.dataobject.CashierShiftDO;
import com.supermarket.erp.module.operation.dal.mysql.CashierShiftMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CashierShiftService {

    private static final ErrorCode SHIFT_NOT_FOUND = new ErrorCode(400201, "Cashier shift not found");

    private final CashierShiftMapper cashierShiftMapper;

    public Long openShift(CashierShiftDO shift) {
        shift.setShiftNo("SFT" + System.currentTimeMillis());
        shift.setStartTime(LocalDateTime.now());
        shift.setStatus(0); // active
        shift.setSalesAmount(BigDecimal.ZERO);
        shift.setOrderCount(0);
        cashierShiftMapper.insert(shift);
        return shift.getId();
    }

    public void closeShift(Long id) {
        CashierShiftDO shift = validateShiftExists(id);
        if (shift.getStatus() != 0) {
            throw new ServiceException(400202, "Only active shifts can be closed");
        }
        shift.setEndTime(LocalDateTime.now());
        shift.setStatus(1); // closed
        cashierShiftMapper.updateById(shift);
    }

    public void updateShiftStats(Long id, BigDecimal salesAmount, Integer orderCount) {
        CashierShiftDO shift = validateShiftExists(id);
        shift.setSalesAmount(shift.getSalesAmount().add(salesAmount));
        shift.setOrderCount(shift.getOrderCount() + orderCount);
        cashierShiftMapper.updateById(shift);
    }

    public CashierShiftDO getShift(Long id) {
        return cashierShiftMapper.selectById(id);
    }

    public PageResult<CashierShiftDO> getShiftPage(PageParam pageParam, Long storeId, Long cashierId, Integer status) {
        LambdaQueryWrapper<CashierShiftDO> query = new LambdaQueryWrapper<CashierShiftDO>()
                .eq(storeId != null, CashierShiftDO::getStoreId, storeId)
                .eq(cashierId != null, CashierShiftDO::getCashierId, cashierId)
                .eq(status != null, CashierShiftDO::getStatus, status)
                .orderByDesc(CashierShiftDO::getId);
        return cashierShiftMapper.selectPage(pageParam, query);
    }

    private CashierShiftDO validateShiftExists(Long id) {
        CashierShiftDO shift = cashierShiftMapper.selectById(id);
        if (shift == null) {
            throw new ServiceException(SHIFT_NOT_FOUND);
        }
        return shift;
    }
}
