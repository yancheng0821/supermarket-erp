package com.supermarket.erp.module.system.controller.admin.tenant;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.framework.security.core.LoginUser;
import com.supermarket.erp.framework.security.util.SecurityFrameworkUtils;
import com.supermarket.erp.module.system.controller.admin.tenant.vo.TenantPageRespVO;
import com.supermarket.erp.module.system.controller.admin.tenant.vo.TenantSaveReqVO;
import com.supermarket.erp.module.system.service.auth.AuthorizationService;
import com.supermarket.erp.module.system.service.tenant.TenantAdminService;
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

@RestController
@RequestMapping("/api/v1/admin/tenant")
@RequiredArgsConstructor
public class TenantController {

    private static final String PERMISSION_PAGE = "platform:tenant:page";
    private static final String PERMISSION_CREATE = "platform:tenant:create";
    private static final String PERMISSION_UPDATE = "platform:tenant:update";
    private static final String PERMISSION_UPDATE_STATUS = "platform:tenant:update-status";

    private final TenantAdminService tenantAdminService;
    private final AuthorizationService authorizationService;

    @GetMapping("/page")
    public CommonResult<PageResult<TenantPageRespVO>> getTenantPage(@Valid PageParam pageParam,
                                                                    @RequestParam(value = "code", required = false) String code,
                                                                    @RequestParam(value = "name", required = false) String name,
                                                                    @RequestParam(value = "status", required = false) Integer status) {
        requirePlatformPermission(PERMISSION_PAGE);
        return CommonResult.success(tenantAdminService.getTenantPage(pageParam, code, name, status));
    }

    @PostMapping
    public CommonResult<Long> createTenant(@Valid @RequestBody TenantSaveReqVO request) {
        requirePlatformPermission(PERMISSION_CREATE);
        return CommonResult.success(tenantAdminService.createTenant(request));
    }

    @PutMapping("/{id}")
    public CommonResult<Boolean> updateTenant(@PathVariable("id") Long id, @Valid @RequestBody TenantSaveReqVO request) {
        requirePlatformPermission(PERMISSION_UPDATE);
        tenantAdminService.updateTenant(id, request);
        return CommonResult.success(true);
    }

    @PutMapping("/{id}/status")
    public CommonResult<Boolean> updateTenantStatus(@PathVariable("id") Long id,
                                                    @RequestParam("status") Integer status) {
        requirePlatformPermission(PERMISSION_UPDATE_STATUS);
        tenantAdminService.updateTenantStatus(id, status);
        return CommonResult.success(true);
    }

    private void requirePlatformPermission(String permission) {
        LoginUser loginUser = SecurityFrameworkUtils.getLoginUser();
        authorizationService.requirePlatformScope(loginUser);
        authorizationService.requirePermission(loginUser, permission);
    }
}
