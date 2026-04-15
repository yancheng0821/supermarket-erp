package com.supermarket.erp.module.archive.service.store;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.archive.dal.dataobject.StoreDO;
import com.supermarket.erp.module.archive.dal.mysql.StoreMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StoreService {

    private static final ErrorCode STORE_NOT_FOUND = new ErrorCode(100001, "Store not found");

    private final StoreMapper storeMapper;

    public Long createStore(StoreDO store) {
        storeMapper.insert(store);
        return store.getId();
    }

    public void updateStore(StoreDO store) {
        validateStoreExists(store.getId());
        storeMapper.updateById(store);
    }

    public void deleteStore(Long id) {
        validateStoreExists(id);
        storeMapper.deleteById(id);
    }

    public StoreDO getStore(Long id) {
        return storeMapper.selectById(id);
    }

    public PageResult<StoreDO> getStorePage(PageParam pageParam, String name, Integer status) {
        LambdaQueryWrapper<StoreDO> query = new LambdaQueryWrapper<StoreDO>()
                .like(name != null, StoreDO::getName, name)
                .eq(status != null, StoreDO::getStatus, status)
                .orderByDesc(StoreDO::getId);
        return storeMapper.selectPage(pageParam, query);
    }

    private void validateStoreExists(Long id) {
        if (storeMapper.selectById(id) == null) {
            throw new ServiceException(STORE_NOT_FOUND);
        }
    }
}
