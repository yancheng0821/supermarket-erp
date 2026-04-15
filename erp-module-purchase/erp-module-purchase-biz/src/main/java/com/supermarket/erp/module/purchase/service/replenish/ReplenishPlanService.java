package com.supermarket.erp.module.purchase.service.replenish;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.purchase.dal.dataobject.PurchaseOrderDO;
import com.supermarket.erp.module.purchase.dal.dataobject.PurchaseOrderItemDO;
import com.supermarket.erp.module.purchase.dal.dataobject.ReplenishPlanDO;
import com.supermarket.erp.module.purchase.dal.mysql.PurchaseOrderMapper;
import com.supermarket.erp.module.purchase.dal.mysql.PurchaseOrderItemMapper;
import com.supermarket.erp.module.purchase.dal.mysql.ReplenishPlanMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReplenishPlanService {

    private static final ErrorCode PLAN_NOT_FOUND = new ErrorCode(300101, "Replenish plan not found");

    private final ReplenishPlanMapper replenishPlanMapper;
    private final PurchaseOrderMapper purchaseOrderMapper;
    private final PurchaseOrderItemMapper purchaseOrderItemMapper;

    public Long createPlan(ReplenishPlanDO plan) {
        plan.setStatus(0);
        replenishPlanMapper.insert(plan);
        return plan.getId();
    }

    public void approvePlan(Long id) {
        ReplenishPlanDO plan = validatePlanExists(id);
        if (plan.getStatus() != 0) {
            throw new ServiceException(300102, "Only pending plans can be approved");
        }
        plan.setStatus(1); // approved
        replenishPlanMapper.updateById(plan);
    }

    @Transactional
    public Long convertToPurchaseOrder(List<Long> planIds, Long supplierId) {
        // Get all plans and verify status
        List<ReplenishPlanDO> plans = replenishPlanMapper.selectBatchIds(planIds);
        for (ReplenishPlanDO plan : plans) {
            if (plan.getStatus() != 1) {
                throw new ServiceException(300103, "All plans must be approved before conversion");
            }
        }

        // Create purchase order
        PurchaseOrderDO order = new PurchaseOrderDO();
        order.setOrderNo("PUR" + System.currentTimeMillis());
        order.setType(1); // centralized
        order.setSupplierId(supplierId);
        order.setStoreId(plans.get(0).getStoreId());
        order.setStatus(0); // draft
        purchaseOrderMapper.insert(order);

        // Create order items from plans
        for (ReplenishPlanDO plan : plans) {
            PurchaseOrderItemDO item = new PurchaseOrderItemDO();
            item.setOrderId(order.getId());
            item.setProductId(plan.getProductId());
            item.setQuantity(plan.getSuggestQuantity());
            purchaseOrderItemMapper.insert(item);

            // Update plan status
            plan.setStatus(2); // converted
            plan.setPurchaseOrderId(order.getId());
            replenishPlanMapper.updateById(plan);
        }

        return order.getId();
    }

    public PageResult<ReplenishPlanDO> getPlanPage(PageParam pageParam, Long storeId, Integer status) {
        LambdaQueryWrapper<ReplenishPlanDO> query = new LambdaQueryWrapper<ReplenishPlanDO>()
                .eq(storeId != null, ReplenishPlanDO::getStoreId, storeId)
                .eq(status != null, ReplenishPlanDO::getStatus, status)
                .orderByDesc(ReplenishPlanDO::getId);
        return replenishPlanMapper.selectPage(pageParam, query);
    }

    private ReplenishPlanDO validatePlanExists(Long id) {
        ReplenishPlanDO plan = replenishPlanMapper.selectById(id);
        if (plan == null) {
            throw new ServiceException(PLAN_NOT_FOUND);
        }
        return plan;
    }
}
