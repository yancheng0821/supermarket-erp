package com.supermarket.erp.module.member.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("mbr_member")
public class MemberDO extends TenantBaseDO {

    @TableId
    private Long id;
    private String phone;
    private String name;
    private String nickname;
    private Integer gender;
    private LocalDate birthday;
    private String avatar;
    private String openid;
    private Integer level;
    private Integer status;
    private Long registerStoreId;
}
