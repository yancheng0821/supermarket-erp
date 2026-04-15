package com.supermarket.erp.module.archive.dal.dataobject;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.supermarket.erp.framework.mybatis.core.TenantBaseDO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("arc_product")
public class ProductDO extends TenantBaseDO {

    @TableId
    private Long id;
    private String name;
    private String barcode;
    private Long categoryId;
    private Long supplierId;
    private String spec;
    private String unit;
    private Integer shelfLife;
    private String imageUrl;
    private Integer status;
    private String remark;
}
