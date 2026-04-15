package com.supermarket.erp.module.finance.service.fee;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.finance.dal.dataobject.FeeRecordDO;
import com.supermarket.erp.module.finance.dal.mysql.FeeRecordMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FeeRecordService {

    private static final ErrorCode FEE_NOT_FOUND = new ErrorCode(700021, "Fee record not found");

    private final FeeRecordMapper feeRecordMapper;

    private String generateFeeNo() {
        return "FEE" + System.currentTimeMillis();
    }

    public Long createFee(FeeRecordDO fee) {
        fee.setFeeNo(generateFeeNo());
        fee.setStatus(0); // draft
        feeRecordMapper.insert(fee);
        return fee.getId();
    }

    public FeeRecordDO getFee(Long id) {
        return feeRecordMapper.selectById(id);
    }

    public void confirmFee(Long id) {
        FeeRecordDO fee = validateExists(id);
        if (fee.getStatus() != 0) {
            throw new ServiceException(700022, "Only draft fee records can be confirmed");
        }
        fee.setStatus(1); // confirmed
        feeRecordMapper.updateById(fee);
    }

    public PageResult<FeeRecordDO> getFeePage(PageParam pageParam, Integer type, Integer targetType, Long targetId, Integer status) {
        LambdaQueryWrapper<FeeRecordDO> query = new LambdaQueryWrapper<FeeRecordDO>()
                .eq(type != null, FeeRecordDO::getType, type)
                .eq(targetType != null, FeeRecordDO::getTargetType, targetType)
                .eq(targetId != null, FeeRecordDO::getTargetId, targetId)
                .eq(status != null, FeeRecordDO::getStatus, status)
                .orderByDesc(FeeRecordDO::getId);
        return feeRecordMapper.selectPage(pageParam, query);
    }

    private FeeRecordDO validateExists(Long id) {
        FeeRecordDO fee = feeRecordMapper.selectById(id);
        if (fee == null) {
            throw new ServiceException(FEE_NOT_FOUND);
        }
        return fee;
    }
}
