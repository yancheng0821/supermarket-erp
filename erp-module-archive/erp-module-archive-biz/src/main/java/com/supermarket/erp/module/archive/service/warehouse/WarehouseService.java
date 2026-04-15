package com.supermarket.erp.module.archive.service.warehouse;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.archive.dal.dataobject.WarehouseDO;
import com.supermarket.erp.module.archive.dal.mysql.WarehouseMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WarehouseService {

    private static final ErrorCode WAREHOUSE_NOT_FOUND = new ErrorCode(100101, "Warehouse not found");

    private final WarehouseMapper warehouseMapper;

    public Long createWarehouse(WarehouseDO warehouse) {
        warehouseMapper.insert(warehouse);
        return warehouse.getId();
    }

    public void updateWarehouse(WarehouseDO warehouse) {
        validateWarehouseExists(warehouse.getId());
        warehouseMapper.updateById(warehouse);
    }

    public void deleteWarehouse(Long id) {
        validateWarehouseExists(id);
        warehouseMapper.deleteById(id);
    }

    public WarehouseDO getWarehouse(Long id) {
        return warehouseMapper.selectById(id);
    }

    public PageResult<WarehouseDO> getWarehousePage(PageParam pageParam, String name, Integer status) {
        LambdaQueryWrapper<WarehouseDO> query = new LambdaQueryWrapper<WarehouseDO>()
                .like(name != null, WarehouseDO::getName, name)
                .eq(status != null, WarehouseDO::getStatus, status)
                .orderByDesc(WarehouseDO::getId);
        return warehouseMapper.selectPage(pageParam, query);
    }

    private void validateWarehouseExists(Long id) {
        if (warehouseMapper.selectById(id) == null) {
            throw new ServiceException(WAREHOUSE_NOT_FOUND);
        }
    }
}
