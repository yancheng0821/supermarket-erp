package com.supermarket.erp.module.member.service.balance;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.member.dal.dataobject.BalanceLogDO;
import com.supermarket.erp.module.member.dal.dataobject.MemberCardDO;
import com.supermarket.erp.module.member.dal.mysql.BalanceLogMapper;
import com.supermarket.erp.module.member.dal.mysql.MemberCardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class BalanceService {

    private static final ErrorCode CARD_NOT_FOUND = new ErrorCode(500101, "Member card not found");
    private static final ErrorCode BALANCE_INSUFFICIENT = new ErrorCode(500201, "Insufficient balance");

    private final MemberCardMapper memberCardMapper;
    private final BalanceLogMapper balanceLogMapper;

    public void topUp(Long cardId, BigDecimal amount, String remark) {
        MemberCardDO card = getCardOrThrow(cardId);

        BigDecimal balanceBefore = card.getBalance();
        BigDecimal balanceAfter = balanceBefore.add(amount);

        // Update card balance
        card.setBalance(balanceAfter);
        memberCardMapper.updateById(card);

        // Insert balance log
        BalanceLogDO log = new BalanceLogDO();
        log.setMemberId(card.getMemberId());
        log.setCardId(cardId);
        log.setType(1); // topup
        log.setAmount(amount);
        log.setBalanceBefore(balanceBefore);
        log.setBalanceAfter(balanceAfter);
        log.setRemark(remark);
        balanceLogMapper.insert(log);
    }

    public void spend(Long cardId, BigDecimal amount, String bizType, Long bizId, String remark) {
        MemberCardDO card = getCardOrThrow(cardId);

        if (card.getBalance().compareTo(amount) < 0) {
            throw new ServiceException(BALANCE_INSUFFICIENT);
        }

        BigDecimal balanceBefore = card.getBalance();
        BigDecimal balanceAfter = balanceBefore.subtract(amount);

        // Update card balance
        card.setBalance(balanceAfter);
        memberCardMapper.updateById(card);

        // Insert balance log
        BalanceLogDO log = new BalanceLogDO();
        log.setMemberId(card.getMemberId());
        log.setCardId(cardId);
        log.setType(2); // spend
        log.setAmount(amount.negate());
        log.setBalanceBefore(balanceBefore);
        log.setBalanceAfter(balanceAfter);
        log.setBizType(bizType);
        log.setBizId(bizId);
        log.setRemark(remark);
        balanceLogMapper.insert(log);
    }

    public void refundBalance(Long cardId, BigDecimal amount, String bizType, Long bizId, String remark) {
        MemberCardDO card = getCardOrThrow(cardId);

        BigDecimal balanceBefore = card.getBalance();
        BigDecimal balanceAfter = balanceBefore.add(amount);

        // Update card balance
        card.setBalance(balanceAfter);
        memberCardMapper.updateById(card);

        // Insert balance log
        BalanceLogDO log = new BalanceLogDO();
        log.setMemberId(card.getMemberId());
        log.setCardId(cardId);
        log.setType(3); // refund
        log.setAmount(amount);
        log.setBalanceBefore(balanceBefore);
        log.setBalanceAfter(balanceAfter);
        log.setBizType(bizType);
        log.setBizId(bizId);
        log.setRemark(remark);
        balanceLogMapper.insert(log);
    }

    public PageResult<BalanceLogDO> getBalanceLog(Long memberId, PageParam pageParam) {
        LambdaQueryWrapper<BalanceLogDO> query = new LambdaQueryWrapper<BalanceLogDO>()
                .eq(BalanceLogDO::getMemberId, memberId)
                .orderByDesc(BalanceLogDO::getId);
        return balanceLogMapper.selectPage(pageParam, query);
    }

    private MemberCardDO getCardOrThrow(Long cardId) {
        MemberCardDO card = memberCardMapper.selectById(cardId);
        if (card == null) {
            throw new ServiceException(CARD_NOT_FOUND);
        }
        return card;
    }
}
