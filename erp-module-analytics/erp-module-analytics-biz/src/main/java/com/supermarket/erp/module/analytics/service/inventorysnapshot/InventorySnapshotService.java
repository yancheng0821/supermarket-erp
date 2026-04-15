package com.supermarket.erp.module.analytics.service.inventorysnapshot;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.analytics.dal.dataobject.InventorySnapshotDO;
import com.supermarket.erp.module.analytics.dal.mysql.InventorySnapshotMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class InventorySnapshotService {

    private final InventorySnapshotMapper inventorySnapshotMapper;

    public PageResult<InventorySnapshotDO> getSnapshotPage(PageParam pageParam, Integer locationType,
                                                            Long locationId, Long productId, LocalDate date) {
        LambdaQueryWrapper<InventorySnapshotDO> query = new LambdaQueryWrapper<InventorySnapshotDO>()
                .eq(locationType != null, InventorySnapshotDO::getLocationType, locationType)
                .eq(locationId != null, InventorySnapshotDO::getLocationId, locationId)
                .eq(productId != null, InventorySnapshotDO::getProductId, productId)
                .eq(date != null, InventorySnapshotDO::getSnapshotDate, date)
                .orderByDesc(InventorySnapshotDO::getSnapshotDate);
        return inventorySnapshotMapper.selectPage(pageParam, query);
    }
}
