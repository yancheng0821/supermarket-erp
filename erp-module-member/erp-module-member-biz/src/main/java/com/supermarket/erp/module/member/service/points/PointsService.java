package com.supermarket.erp.module.member.service.points;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.member.dal.dataobject.MemberCardDO;
import com.supermarket.erp.module.member.dal.dataobject.PointsLogDO;
import com.supermarket.erp.module.member.dal.mysql.MemberCardMapper;
import com.supermarket.erp.module.member.dal.mysql.PointsLogMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PointsService {

    private static final ErrorCode CARD_NOT_FOUND = new ErrorCode(500101, "Member card not found");
    private static final ErrorCode POINTS_INSUFFICIENT = new ErrorCode(500102, "Insufficient points");

    private final MemberCardMapper memberCardMapper;
    private final PointsLogMapper pointsLogMapper;

    public void earnPoints(Long cardId, Integer points, String bizType, Long bizId, String remark) {
        MemberCardDO card = getCardOrThrow(cardId);

        Integer pointsBefore = card.getPoints();
        Integer pointsAfter = pointsBefore + points;

        // Update card points
        card.setPoints(pointsAfter);
        memberCardMapper.updateById(card);

        // Insert points log
        PointsLogDO log = new PointsLogDO();
        log.setMemberId(card.getMemberId());
        log.setCardId(cardId);
        log.setType(1); // earn
        log.setPoints(points);
        log.setPointsBefore(pointsBefore);
        log.setPointsAfter(pointsAfter);
        log.setBizType(bizType);
        log.setBizId(bizId);
        log.setRemark(remark);
        pointsLogMapper.insert(log);
    }

    public void redeemPoints(Long cardId, Integer points, String bizType, Long bizId, String remark) {
        MemberCardDO card = getCardOrThrow(cardId);

        if (card.getPoints() < points) {
            throw new ServiceException(POINTS_INSUFFICIENT);
        }

        Integer pointsBefore = card.getPoints();
        Integer pointsAfter = pointsBefore - points;

        // Update card points
        card.setPoints(pointsAfter);
        memberCardMapper.updateById(card);

        // Insert points log
        PointsLogDO log = new PointsLogDO();
        log.setMemberId(card.getMemberId());
        log.setCardId(cardId);
        log.setType(2); // redeem
        log.setPoints(-points);
        log.setPointsBefore(pointsBefore);
        log.setPointsAfter(pointsAfter);
        log.setBizType(bizType);
        log.setBizId(bizId);
        log.setRemark(remark);
        pointsLogMapper.insert(log);
    }

    public PageResult<PointsLogDO> getPointsLog(Long memberId, PageParam pageParam) {
        LambdaQueryWrapper<PointsLogDO> query = new LambdaQueryWrapper<PointsLogDO>()
                .eq(PointsLogDO::getMemberId, memberId)
                .orderByDesc(PointsLogDO::getId);
        return pointsLogMapper.selectPage(pageParam, query);
    }

    private MemberCardDO getCardOrThrow(Long cardId) {
        MemberCardDO card = memberCardMapper.selectById(cardId);
        if (card == null) {
            throw new ServiceException(CARD_NOT_FOUND);
        }
        return card;
    }
}
