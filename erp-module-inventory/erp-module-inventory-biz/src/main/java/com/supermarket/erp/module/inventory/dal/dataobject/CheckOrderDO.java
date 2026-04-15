package com.supermarket.erp.module.inventory.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("inv_check_order")
public class CheckOrderDO extends TenantBaseDO {

    @TableId
    private Long id;
    private String orderNo;
    private Integer locationType;
    private Long locationId;
    private Integer status;
    private String remark;
}
