package com.supermarket.erp.module.member.controller.admin.balance;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.member.dal.dataobject.BalanceLogDO;
import com.supermarket.erp.module.member.service.balance.BalanceService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/admin/member/balance")
@RequiredArgsConstructor
public class BalanceController {

    private final BalanceService balanceService;

    @PostMapping("/topup")
    public CommonResult<Boolean> topUp(@RequestBody TopUpRequest request) {
        balanceService.topUp(request.getCardId(), request.getAmount(), request.getRemark());
        return CommonResult.success(true);
    }

    @PostMapping("/spend")
    public CommonResult<Boolean> spend(@RequestBody SpendRequest request) {
        balanceService.spend(request.getCardId(), request.getAmount(),
                request.getBizType(), request.getBizId(), request.getRemark());
        return CommonResult.success(true);
    }

    @PostMapping("/refund")
    public CommonResult<Boolean> refundBalance(@RequestBody SpendRequest request) {
        balanceService.refundBalance(request.getCardId(), request.getAmount(),
                request.getBizType(), request.getBizId(), request.getRemark());
        return CommonResult.success(true);
    }

    @GetMapping("/log")
    public CommonResult<PageResult<BalanceLogDO>> getBalanceLog(@RequestParam Long memberId,
                                                                 @Valid PageParam pageParam) {
        PageResult<BalanceLogDO> page = balanceService.getBalanceLog(memberId, pageParam);
        return CommonResult.success(page);
    }

    @Data
    public static class TopUpRequest {
        private Long cardId;
        private BigDecimal amount;
        private String remark;
    }

    @Data
    public static class SpendRequest {
        private Long cardId;
        private BigDecimal amount;
        private String bizType;
        private Long bizId;
        private String remark;
    }
}
