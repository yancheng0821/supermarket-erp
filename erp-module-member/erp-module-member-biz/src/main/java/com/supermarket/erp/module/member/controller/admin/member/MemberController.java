package com.supermarket.erp.module.member.controller.admin.member;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.member.dal.dataobject.MemberDO;
import com.supermarket.erp.module.member.service.member.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/member/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/register")
    public CommonResult<Long> register(@RequestBody MemberDO member) {
        Long id = memberService.register(member);
        return CommonResult.success(id);
    }

    @PutMapping
    public CommonResult<Boolean> updateMember(@RequestBody MemberDO member) {
        memberService.updateMember(member);
        return CommonResult.success(true);
    }

    @GetMapping("/{id}")
    public CommonResult<MemberDO> getMember(@PathVariable Long id) {
        MemberDO member = memberService.getMember(id);
        return CommonResult.success(member);
    }

    @GetMapping("/phone/{phone}")
    public CommonResult<MemberDO> getMemberByPhone(@PathVariable String phone) {
        MemberDO member = memberService.getMemberByPhone(phone);
        return CommonResult.success(member);
    }

    @GetMapping("/page")
    public CommonResult<PageResult<MemberDO>> getMemberPage(@Valid PageParam pageParam,
                                                             @RequestParam(required = false) String phone,
                                                             @RequestParam(required = false) String name,
                                                             @RequestParam(required = false) Integer level) {
        PageResult<MemberDO> page = memberService.getMemberPage(pageParam, phone, name, level);
        return CommonResult.success(page);
    }
}
