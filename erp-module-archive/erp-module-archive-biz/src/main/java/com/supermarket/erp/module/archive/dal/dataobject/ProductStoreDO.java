package com.supermarket.erp.module.archive.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("arc_product_store")
public class ProductStoreDO extends TenantBaseDO {

    @TableId
    private Long id;
    private Long productId;
    private Long storeId;
    private Integer status;
    private Integer minStock;
    private Integer maxStock;
}
