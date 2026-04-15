package com.supermarket.erp.module.online.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("onl_online_product")
public class OnlineProductDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long productId;
    private Long storeId;
    private String mainImage;
    private String images;
    private String description;
    private Integer sort;
    private Integer status;
}
