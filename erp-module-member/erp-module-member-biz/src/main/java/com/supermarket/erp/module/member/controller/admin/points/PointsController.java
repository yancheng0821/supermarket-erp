package com.supermarket.erp.module.member.controller.admin.points;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.member.dal.dataobject.PointsLogDO;
import com.supermarket.erp.module.member.service.points.PointsService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/member/points")
@RequiredArgsConstructor
public class PointsController {

    private final PointsService pointsService;

    @PostMapping("/earn")
    public CommonResult<Boolean> earnPoints(@RequestBody EarnPointsRequest request) {
        pointsService.earnPoints(request.getCardId(), request.getPoints(),
                request.getBizType(), request.getBizId(), request.getRemark());
        return CommonResult.success(true);
    }

    @PostMapping("/redeem")
    public CommonResult<Boolean> redeemPoints(@RequestBody EarnPointsRequest request) {
        pointsService.redeemPoints(request.getCardId(), request.getPoints(),
                request.getBizType(), request.getBizId(), request.getRemark());
        return CommonResult.success(true);
    }

    @GetMapping("/log")
    public CommonResult<PageResult<PointsLogDO>> getPointsLog(@RequestParam Long memberId,
                                                               @Valid PageParam pageParam) {
        PageResult<PointsLogDO> page = pointsService.getPointsLog(memberId, pageParam);
        return CommonResult.success(page);
    }

    @Data
    public static class EarnPointsRequest {
        private Long cardId;
        private Integer points;
        private String bizType;
        private Long bizId;
        private String remark;
    }
}
