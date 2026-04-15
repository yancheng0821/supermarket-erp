package com.supermarket.erp.module.inventory.service.issue;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.common.exception.ErrorCode;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.module.inventory.dal.dataobject.IssueOrderDO;
import com.supermarket.erp.module.inventory.dal.dataobject.IssueOrderItemDO;
import com.supermarket.erp.module.inventory.dal.mysql.IssueOrderMapper;
import com.supermarket.erp.module.inventory.dal.mysql.IssueOrderItemMapper;
import com.supermarket.erp.module.inventory.service.stock.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IssueOrderService {

    private static final ErrorCode ORDER_NOT_FOUND = new ErrorCode(200201, "Issue order not found");

    private final IssueOrderMapper issueOrderMapper;
    private final IssueOrderItemMapper issueOrderItemMapper;
    private final StockService stockService;

    private String generateOrderNo() {
        return "ISS" + System.currentTimeMillis();
    }

    public Long createOrder(IssueOrderDO order) {
        order.setOrderNo(generateOrderNo());
        order.setStatus(0);
        issueOrderMapper.insert(order);
        return order.getId();
    }

    public void addItem(IssueOrderItemDO item) {
        issueOrderItemMapper.insert(item);
    }

    public IssueOrderDO getOrder(Long id) {
        return issueOrderMapper.selectById(id);
    }

    public List<IssueOrderItemDO> getItems(Long orderId) {
        LambdaQueryWrapper<IssueOrderItemDO> query = new LambdaQueryWrapper<IssueOrderItemDO>()
                .eq(IssueOrderItemDO::getOrderId, orderId);
        return issueOrderItemMapper.selectList(query);
    }

    @Transactional
    public void confirmOrder(Long id) {
        IssueOrderDO order = issueOrderMapper.selectById(id);
        if (order == null) {
            throw new ServiceException(ORDER_NOT_FOUND);
        }
        if (order.getStatus() != 0) {
            return;
        }
        order.setStatus(1);
        issueOrderMapper.updateById(order);

        List<IssueOrderItemDO> items = getItems(id);
        for (IssueOrderItemDO item : items) {
            stockService.decreaseStock(item.getProductId(), order.getLocationType(), order.getLocationId(),
                    item.getQuantity(), 2 /* issue */, order.getId());
        }
    }

    public PageResult<IssueOrderDO> getOrderPage(PageParam pageParam, Integer type, Integer status) {
        LambdaQueryWrapper<IssueOrderDO> query = new LambdaQueryWrapper<IssueOrderDO>()
                .eq(type != null, IssueOrderDO::getType, type)
                .eq(status != null, IssueOrderDO::getStatus, status)
                .orderByDesc(IssueOrderDO::getId);
        return issueOrderMapper.selectPage(pageParam, query);
    }
}
