package com.supermarket.erp.module.member.api.member;

import com.supermarket.erp.module.member.api.member.dto.MemberDTO;

public interface MemberApi {

    MemberDTO getMember(Long id);

    MemberDTO getMemberByPhone(String phone);
}
