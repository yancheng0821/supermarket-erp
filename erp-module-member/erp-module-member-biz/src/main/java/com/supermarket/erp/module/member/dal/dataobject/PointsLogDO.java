package com.supermarket.erp.module.member.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("mbr_points_log")
public class PointsLogDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long memberId;
    private Long cardId;
    private Integer type;
    private Integer points;
    private Integer pointsBefore;
    private Integer pointsAfter;
    private String bizType;
    private Long bizId;
    private String remark;
}
