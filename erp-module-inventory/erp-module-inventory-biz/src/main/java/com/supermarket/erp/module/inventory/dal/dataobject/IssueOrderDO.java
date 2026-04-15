package com.supermarket.erp.module.inventory.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("inv_issue_order")
public class IssueOrderDO extends TenantBaseDO {

    @TableId
    private Long id;
    private String orderNo;
    private Integer type;
    private Integer locationType;
    private Long locationId;
    private Integer status;
    private String remark;
}
