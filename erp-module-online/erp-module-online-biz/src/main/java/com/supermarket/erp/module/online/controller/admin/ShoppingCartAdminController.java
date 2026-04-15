package com.supermarket.erp.module.online.controller.admin;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.module.online.dal.dataobject.ShoppingCartDO;
import com.supermarket.erp.module.online.service.cart.ShoppingCartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/online/cart")
@RequiredArgsConstructor
public class ShoppingCartAdminController {

    private final ShoppingCartService shoppingCartService;

    @GetMapping("/member/{memberId}/store/{storeId}")
    public CommonResult<List<ShoppingCartDO>> getCart(@PathVariable Long memberId,
                                                      @PathVariable Long storeId) {
        List<ShoppingCartDO> cart = shoppingCartService.getCart(memberId, storeId);
        return CommonResult.success(cart);
    }
}
