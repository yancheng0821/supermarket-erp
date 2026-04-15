package com.supermarket.erp.module.online.controller.app;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.module.online.dal.dataobject.DeliveryOrderDO;
import com.supermarket.erp.module.online.dal.dataobject.OnlineProductDO;
import com.supermarket.erp.module.online.dal.dataobject.ShoppingCartDO;
import com.supermarket.erp.module.online.dal.dataobject.StoreConfigDO;
import com.supermarket.erp.module.online.service.cart.ShoppingCartService;
import com.supermarket.erp.module.online.service.config.StoreConfigService;
import com.supermarket.erp.module.online.service.delivery.DeliveryOrderService;
import com.supermarket.erp.module.online.service.product.OnlineProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/app/online")
@RequiredArgsConstructor
public class AppOnlineController {

    private final OnlineProductService onlineProductService;
    private final ShoppingCartService shoppingCartService;
    private final StoreConfigService storeConfigService;
    private final DeliveryOrderService deliveryOrderService;

    // ---- Product ----

    @GetMapping("/products")
    public CommonResult<List<OnlineProductDO>> listProducts(@RequestParam Long storeId,
                                                             @RequestParam(defaultValue = "0") Integer status) {
        List<OnlineProductDO> list = onlineProductService.listByStore(storeId, status);
        return CommonResult.success(list);
    }

    @GetMapping("/product/{id}")
    public CommonResult<OnlineProductDO> getProduct(@PathVariable Long id) {
        OnlineProductDO product = onlineProductService.getProduct(id);
        return CommonResult.success(product);
    }

    // ---- Cart ----

    @PostMapping("/cart")
    public CommonResult<Long> addToCart(@RequestBody ShoppingCartDO cart) {
        Long id = shoppingCartService.addToCart(cart);
        return CommonResult.success(id);
    }

    @PutMapping("/cart/{id}")
    public CommonResult<Boolean> updateQuantity(@PathVariable Long id,
                                                 @RequestParam BigDecimal quantity) {
        shoppingCartService.updateQuantity(id, quantity);
        return CommonResult.success(true);
    }

    @DeleteMapping("/cart/{id}")
    public CommonResult<Boolean> removeFromCart(@PathVariable Long id) {
        shoppingCartService.removeFromCart(id);
        return CommonResult.success(true);
    }

    @GetMapping("/cart")
    public CommonResult<List<ShoppingCartDO>> getCart(@RequestParam Long memberId,
                                                      @RequestParam Long storeId) {
        List<ShoppingCartDO> cart = shoppingCartService.getCart(memberId, storeId);
        return CommonResult.success(cart);
    }

    @DeleteMapping("/cart/clear")
    public CommonResult<Boolean> clearCart(@RequestParam Long memberId,
                                           @RequestParam Long storeId) {
        shoppingCartService.clearCart(memberId, storeId);
        return CommonResult.success(true);
    }

    // ---- Store Config ----

    @GetMapping("/store-config/{storeId}")
    public CommonResult<StoreConfigDO> getStoreConfig(@PathVariable Long storeId) {
        StoreConfigDO config = storeConfigService.getConfig(storeId);
        return CommonResult.success(config);
    }

    // ---- Delivery ----

    @GetMapping("/delivery/{id}")
    public CommonResult<DeliveryOrderDO> getDeliveryOrder(@PathVariable Long id) {
        DeliveryOrderDO order = deliveryOrderService.getOrder(id);
        return CommonResult.success(order);
    }

    @GetMapping("/delivery/by-order/{salesOrderId}")
    public CommonResult<DeliveryOrderDO> getDeliveryBySalesOrder(@PathVariable Long salesOrderId) {
        DeliveryOrderDO order = deliveryOrderService.getOrderBySalesOrder(salesOrderId);
        return CommonResult.success(order);
    }
}
