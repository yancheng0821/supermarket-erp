package com.supermarket.erp.module.archive.service.supplier;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.archive.dal.dataobject.SupplierDO;
import com.supermarket.erp.module.archive.dal.mysql.SupplierMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private static final ErrorCode SUPPLIER_NOT_FOUND = new ErrorCode(100201, "Supplier not found");

    private final SupplierMapper supplierMapper;

    public Long createSupplier(SupplierDO supplier) {
        supplierMapper.insert(supplier);
        return supplier.getId();
    }

    public void updateSupplier(SupplierDO supplier) {
        validateSupplierExists(supplier.getId());
        supplierMapper.updateById(supplier);
    }

    public void deleteSupplier(Long id) {
        validateSupplierExists(id);
        supplierMapper.deleteById(id);
    }

    public SupplierDO getSupplier(Long id) {
        return supplierMapper.selectById(id);
    }

    public PageResult<SupplierDO> getSupplierPage(PageParam pageParam, String name, Integer status) {
        LambdaQueryWrapper<SupplierDO> query = new LambdaQueryWrapper<SupplierDO>()
                .like(name != null, SupplierDO::getName, name)
                .eq(status != null, SupplierDO::getStatus, status)
                .orderByDesc(SupplierDO::getId);
        return supplierMapper.selectPage(pageParam, query);
    }

    private void validateSupplierExists(Long id) {
        if (supplierMapper.selectById(id) == null) {
            throw new ServiceException(SUPPLIER_NOT_FOUND);
        }
    }
}
