package com.supermarket.erp.module.online.service.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.online.dal.dataobject.StoreConfigDO;
import com.supermarket.erp.module.online.dal.mysql.StoreConfigMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StoreConfigService {

    private final StoreConfigMapper storeConfigMapper;

    public Long saveConfig(StoreConfigDO config) {
        StoreConfigDO existing = storeConfigMapper.selectOne(new LambdaQueryWrapper<StoreConfigDO>()
                .eq(StoreConfigDO::getStoreId, config.getStoreId()));
        if (existing != null) {
            config.setId(existing.getId());
            storeConfigMapper.updateById(config);
            return existing.getId();
        }
        storeConfigMapper.insert(config);
        return config.getId();
    }

    public StoreConfigDO getConfig(Long storeId) {
        return storeConfigMapper.selectOne(new LambdaQueryWrapper<StoreConfigDO>()
                .eq(StoreConfigDO::getStoreId, storeId));
    }

    public PageResult<StoreConfigDO> getConfigPage(PageParam pageParam, Boolean onlineEnabled) {
        LambdaQueryWrapper<StoreConfigDO> query = new LambdaQueryWrapper<StoreConfigDO>()
                .eq(onlineEnabled != null, StoreConfigDO::getOnlineEnabled, onlineEnabled)
                .orderByDesc(StoreConfigDO::getId);
        return storeConfigMapper.selectPage(pageParam, query);
    }
}
