package com.supermarket.erp.module.finance.service.voucher;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.finance.dal.dataobject.VoucherDO;
import com.supermarket.erp.module.finance.dal.mysql.VoucherMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VoucherService {

    private static final ErrorCode VOUCHER_NOT_FOUND = new ErrorCode(700031, "Voucher not found");

    private final VoucherMapper voucherMapper;

    private String generateVoucherNo() {
        return "VCH" + System.currentTimeMillis();
    }

    public Long createVoucher(VoucherDO voucher) {
        voucher.setVoucherNo(generateVoucherNo());
        voucher.setStatus(0); // draft
        voucherMapper.insert(voucher);
        return voucher.getId();
    }

    public VoucherDO getVoucher(Long id) {
        return voucherMapper.selectById(id);
    }

    public void postVoucher(Long id) {
        VoucherDO voucher = validateExists(id);
        if (voucher.getStatus() != 0) {
            throw new ServiceException(700032, "Only draft vouchers can be posted");
        }
        voucher.setStatus(1); // posted
        voucherMapper.updateById(voucher);
    }

    public PageResult<VoucherDO> getVoucherPage(PageParam pageParam, String bizType, String period, Integer status) {
        LambdaQueryWrapper<VoucherDO> query = new LambdaQueryWrapper<VoucherDO>()
                .eq(bizType != null, VoucherDO::getBizType, bizType)
                .eq(period != null, VoucherDO::getPeriod, period)
                .eq(status != null, VoucherDO::getStatus, status)
                .orderByDesc(VoucherDO::getId);
        return voucherMapper.selectPage(pageParam, query);
    }

    private VoucherDO validateExists(Long id) {
        VoucherDO voucher = voucherMapper.selectById(id);
        if (voucher == null) {
            throw new ServiceException(VOUCHER_NOT_FOUND);
        }
        return voucher;
    }
}
