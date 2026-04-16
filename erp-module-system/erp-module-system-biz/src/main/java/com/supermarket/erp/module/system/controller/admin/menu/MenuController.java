package com.supermarket.erp.module.system.controller.admin.menu;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.framework.security.core.LoginUser;
import com.supermarket.erp.framework.security.util.SecurityFrameworkUtils;
import com.supermarket.erp.module.system.controller.admin.menu.vo.MenuSaveReqVO;
import com.supermarket.erp.module.system.controller.admin.menu.vo.MenuTreeRespVO;
import com.supermarket.erp.module.system.service.auth.AuthorizationService;
import com.supermarket.erp.module.system.service.menu.MenuAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/menu")
@RequiredArgsConstructor
public class MenuController {

    private static final String PERMISSION_TREE = "platform:menu:tree";
    private static final String PERMISSION_CREATE = "platform:menu:create";
    private static final String PERMISSION_UPDATE = "platform:menu:update";

    private final MenuAdminService menuAdminService;
    private final AuthorizationService authorizationService;

    @GetMapping("/tree")
    public CommonResult<List<MenuTreeRespVO>> getMenuTree(@RequestParam(value = "scope", required = false) String scope) {
        requirePlatformPermission(PERMISSION_TREE);
        return CommonResult.success(menuAdminService.getMenuTree(scope));
    }

    @PostMapping
    public CommonResult<Long> createMenu(@Valid @RequestBody MenuSaveReqVO request) {
        requirePlatformPermission(PERMISSION_CREATE);
        return CommonResult.success(menuAdminService.createMenu(request));
    }

    @PutMapping("/{id}")
    public CommonResult<Boolean> updateMenu(@PathVariable("id") Long id, @Valid @RequestBody MenuSaveReqVO request) {
        requirePlatformPermission(PERMISSION_UPDATE);
        menuAdminService.updateMenu(id, request);
        return CommonResult.success(true);
    }

    private void requirePlatformPermission(String permission) {
        LoginUser loginUser = SecurityFrameworkUtils.getLoginUser();
        authorizationService.requirePlatformScope(loginUser);
        authorizationService.requirePermission(loginUser, permission);
    }
}
