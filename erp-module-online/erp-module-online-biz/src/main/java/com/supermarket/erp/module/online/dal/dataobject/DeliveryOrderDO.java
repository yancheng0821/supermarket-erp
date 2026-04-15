package com.supermarket.erp.module.online.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("onl_delivery_order")
public class DeliveryOrderDO extends TenantBaseDO {

    @TableId
    private Long id;
    private String orderNo;
    private Long salesOrderId;
    private Long storeId;
    private Long memberId;
    private Integer deliveryType;
    private String contactName;
    private String contactPhone;
    private String address;
    private LocalDateTime expectedTime;
    private LocalDateTime actualTime;
    private Integer status;
    private String remark;
}
