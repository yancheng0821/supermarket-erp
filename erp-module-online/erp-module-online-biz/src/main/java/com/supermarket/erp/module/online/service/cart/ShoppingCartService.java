package com.supermarket.erp.module.online.service.cart;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.supermarket.erp.module.online.dal.dataobject.ShoppingCartDO;
import com.supermarket.erp.module.online.dal.mysql.ShoppingCartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShoppingCartService {

    private final ShoppingCartMapper shoppingCartMapper;

    public Long addToCart(ShoppingCartDO cart) {
        // Check if same member+store+product exists
        ShoppingCartDO existing = shoppingCartMapper.selectOne(new LambdaQueryWrapper<ShoppingCartDO>()
                .eq(ShoppingCartDO::getMemberId, cart.getMemberId())
                .eq(ShoppingCartDO::getStoreId, cart.getStoreId())
                .eq(ShoppingCartDO::getProductId, cart.getProductId()));
        if (existing != null) {
            existing.setQuantity(existing.getQuantity().add(cart.getQuantity()));
            shoppingCartMapper.updateById(existing);
            return existing.getId();
        }
        shoppingCartMapper.insert(cart);
        return cart.getId();
    }

    public void updateQuantity(Long id, BigDecimal quantity) {
        if (quantity.compareTo(BigDecimal.ZERO) <= 0) {
            shoppingCartMapper.deleteById(id);
            return;
        }
        ShoppingCartDO cart = shoppingCartMapper.selectById(id);
        cart.setQuantity(quantity);
        shoppingCartMapper.updateById(cart);
    }

    public void removeFromCart(Long id) {
        shoppingCartMapper.deleteById(id);
    }

    public List<ShoppingCartDO> getCart(Long memberId, Long storeId) {
        return shoppingCartMapper.selectList(new LambdaQueryWrapper<ShoppingCartDO>()
                .eq(ShoppingCartDO::getMemberId, memberId)
                .eq(ShoppingCartDO::getStoreId, storeId)
                .orderByDesc(ShoppingCartDO::getCreateTime));
    }

    public void clearCart(Long memberId, Long storeId) {
        shoppingCartMapper.delete(new LambdaQueryWrapper<ShoppingCartDO>()
                .eq(ShoppingCartDO::getMemberId, memberId)
                .eq(ShoppingCartDO::getStoreId, storeId));
    }
}
