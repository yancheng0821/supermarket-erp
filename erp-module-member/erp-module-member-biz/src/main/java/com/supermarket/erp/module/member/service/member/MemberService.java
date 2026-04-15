package com.supermarket.erp.module.member.service.member;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.member.dal.dataobject.MemberCardDO;
import com.supermarket.erp.module.member.dal.dataobject.MemberDO;
import com.supermarket.erp.module.member.dal.mysql.MemberCardMapper;
import com.supermarket.erp.module.member.dal.mysql.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class MemberService {

    private static final ErrorCode MEMBER_NOT_FOUND = new ErrorCode(500001, "Member not found");
    private static final ErrorCode PHONE_ALREADY_EXISTS = new ErrorCode(500002, "Phone number already registered");

    private final MemberMapper memberMapper;
    private final MemberCardMapper memberCardMapper;

    @Transactional
    public Long register(MemberDO member) {
        // Check phone uniqueness
        MemberDO existing = memberMapper.selectOne(new LambdaQueryWrapper<MemberDO>()
                .eq(MemberDO::getPhone, member.getPhone()));
        if (existing != null) {
            throw new ServiceException(PHONE_ALREADY_EXISTS);
        }

        // Set defaults and insert member
        member.setLevel(1);
        member.setStatus(0);
        memberMapper.insert(member);

        // Create member card
        MemberCardDO card = new MemberCardDO();
        card.setMemberId(member.getId());
        card.setCardNo("MBR" + System.currentTimeMillis());
        card.setLevel(1);
        card.setBalance(BigDecimal.ZERO);
        card.setPoints(0);
        card.setTotalSpend(BigDecimal.ZERO);
        card.setStatus(0);
        memberCardMapper.insert(card);

        return member.getId();
    }

    public void updateMember(MemberDO member) {
        validateMemberExists(member.getId());
        memberMapper.updateById(member);
    }

    public MemberDO getMember(Long id) {
        return memberMapper.selectById(id);
    }

    public MemberDO getMemberByPhone(String phone) {
        return memberMapper.selectOne(new LambdaQueryWrapper<MemberDO>()
                .eq(MemberDO::getPhone, phone));
    }

    public PageResult<MemberDO> getMemberPage(PageParam pageParam, String phone, String name, Integer level) {
        LambdaQueryWrapper<MemberDO> query = new LambdaQueryWrapper<MemberDO>()
                .like(phone != null, MemberDO::getPhone, phone)
                .like(name != null, MemberDO::getName, name)
                .eq(level != null, MemberDO::getLevel, level)
                .orderByDesc(MemberDO::getId);
        return memberMapper.selectPage(pageParam, query);
    }

    private void validateMemberExists(Long id) {
        if (memberMapper.selectById(id) == null) {
            throw new ServiceException(MEMBER_NOT_FOUND);
        }
    }
}
