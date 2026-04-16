package com.supermarket.erp.module.system.controller.admin.role;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.framework.security.core.LoginUser;
import com.supermarket.erp.framework.security.util.SecurityFrameworkUtils;
import com.supermarket.erp.module.system.controller.admin.role.vo.RoleAssignMenusReqVO;
import com.supermarket.erp.module.system.controller.admin.role.vo.RolePageRespVO;
import com.supermarket.erp.module.system.controller.admin.role.vo.RoleSaveReqVO;
import com.supermarket.erp.module.system.service.auth.AuthorizationService;
import com.supermarket.erp.module.system.service.role.SystemRoleAdminService;
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
@RequestMapping("/api/v1/admin/role")
@RequiredArgsConstructor
public class RoleController {

    private static final String PERMISSION_PAGE = "system:role:page";
    private static final String PERMISSION_CREATE = "system:role:create";
    private static final String PERMISSION_UPDATE = "system:role:update";
    private static final String PERMISSION_UPDATE_STATUS = "system:role:update-status";
    private static final String PERMISSION_ASSIGN_MENU = "system:role:assign-menu";

    private final SystemRoleAdminService systemRoleAdminService;
    private final AuthorizationService authorizationService;

    @GetMapping("/page")
    public CommonResult<PageResult<RolePageRespVO>> getRolePage(@Valid PageParam pageParam,
                                                                @RequestParam(value = "name", required = false) String name,
                                                                @RequestParam(value = "code", required = false) String code,
                                                                @RequestParam(value = "status", required = false) Integer status) {
        LoginUser loginUser = requireTenantPermission(PERMISSION_PAGE);
        return CommonResult.success(systemRoleAdminService.getRolePage(
                loginUser.getTenantId(),
                pageParam,
                name,
                code,
                status
        ));
    }

    @PostMapping
    public CommonResult<Long> createRole(@Valid @RequestBody RoleSaveReqVO request) {
        LoginUser loginUser = requireTenantPermission(PERMISSION_CREATE);
        return CommonResult.success(systemRoleAdminService.createRole(loginUser.getTenantId(), request));
    }

    @PutMapping("/{id}")
    public CommonResult<Boolean> updateRole(@PathVariable("id") Long id, @Valid @RequestBody RoleSaveReqVO request) {
        LoginUser loginUser = requireTenantPermission(PERMISSION_UPDATE);
        systemRoleAdminService.updateRole(loginUser.getTenantId(), id, request);
        return CommonResult.success(true);
    }

    @PutMapping("/{id}/status")
    public CommonResult<Boolean> updateRoleStatus(@PathVariable("id") Long id,
                                                  @RequestParam("status") Integer status) {
        LoginUser loginUser = requireTenantPermission(PERMISSION_UPDATE_STATUS);
        systemRoleAdminService.updateRoleStatus(loginUser.getTenantId(), id, status);
        return CommonResult.success(true);
    }

    @PutMapping("/{id}/menus")
    public CommonResult<Boolean> assignMenus(@PathVariable("id") Long id,
                                             @Valid @RequestBody RoleAssignMenusReqVO request) {
        LoginUser loginUser = requireTenantPermission(PERMISSION_ASSIGN_MENU);
        systemRoleAdminService.assignMenus(loginUser.getTenantId(), id, request.getMenuIds());
        return CommonResult.success(true);
    }

    private LoginUser requireTenantPermission(String permission) {
        LoginUser loginUser = SecurityFrameworkUtils.getLoginUser();
        authorizationService.requireTenantScope(loginUser);
        authorizationService.requirePermission(loginUser, permission);
        return loginUser;
    }
}
