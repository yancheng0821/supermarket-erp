package com.supermarket.erp.module.system.controller.admin.user;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.common.pojo.PageParam;
import com.supermarket.erp.common.pojo.PageResult;
import com.supermarket.erp.framework.security.core.LoginUser;
import com.supermarket.erp.framework.security.util.SecurityFrameworkUtils;
import com.supermarket.erp.module.system.controller.admin.user.vo.UserAssignRolesReqVO;
import com.supermarket.erp.module.system.controller.admin.user.vo.UserPageRespVO;
import com.supermarket.erp.module.system.controller.admin.user.vo.UserResetPasswordReqVO;
import com.supermarket.erp.module.system.controller.admin.user.vo.UserSaveReqVO;
import com.supermarket.erp.module.system.service.auth.AuthorizationService;
import com.supermarket.erp.module.system.service.user.SystemUserAdminService;
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
@RequestMapping("/api/v1/admin/user")
@RequiredArgsConstructor
public class UserController {

    private static final String PERMISSION_PAGE = "system:user:page";
    private static final String PERMISSION_CREATE = "system:user:create";
    private static final String PERMISSION_UPDATE = "system:user:update";
    private static final String PERMISSION_UPDATE_STATUS = "system:user:update-status";
    private static final String PERMISSION_RESET_PASSWORD = "system:user:reset-password";
    private static final String PERMISSION_ASSIGN_ROLE = "system:user:assign-role";

    private final SystemUserAdminService systemUserAdminService;
    private final AuthorizationService authorizationService;

    @GetMapping("/page")
    public CommonResult<PageResult<UserPageRespVO>> getUserPage(@Valid PageParam pageParam,
                                                                @RequestParam(value = "username", required = false) String username,
                                                                @RequestParam(value = "nickname", required = false) String nickname,
                                                                @RequestParam(value = "status", required = false) Integer status) {
        LoginUser loginUser = requireTenantPermission(PERMISSION_PAGE);
        return CommonResult.success(systemUserAdminService.getUserPage(
                loginUser.getTenantId(),
                pageParam,
                username,
                nickname,
                status
        ));
    }

    @PostMapping
    public CommonResult<Long> createUser(@Valid @RequestBody UserSaveReqVO request) {
        LoginUser loginUser = requireTenantPermission(PERMISSION_CREATE);
        return CommonResult.success(systemUserAdminService.createUser(loginUser.getTenantId(), request));
    }

    @PutMapping("/{id}")
    public CommonResult<Boolean> updateUser(@PathVariable("id") Long id, @Valid @RequestBody UserSaveReqVO request) {
        LoginUser loginUser = requireTenantPermission(PERMISSION_UPDATE);
        systemUserAdminService.updateUser(loginUser.getTenantId(), id, request);
        return CommonResult.success(true);
    }

    @PutMapping("/{id}/status")
    public CommonResult<Boolean> updateUserStatus(@PathVariable("id") Long id,
                                                  @RequestParam("status") Integer status) {
        LoginUser loginUser = requireTenantPermission(PERMISSION_UPDATE_STATUS);
        systemUserAdminService.updateUserStatus(loginUser.getTenantId(), id, status);
        return CommonResult.success(true);
    }

    @PutMapping("/{id}/reset-password")
    public CommonResult<Boolean> resetPassword(@PathVariable("id") Long id,
                                               @Valid @RequestBody UserResetPasswordReqVO request) {
        LoginUser loginUser = requireTenantPermission(PERMISSION_RESET_PASSWORD);
        systemUserAdminService.resetPassword(loginUser.getTenantId(), id, request.getPassword());
        return CommonResult.success(true);
    }

    @PutMapping("/{id}/roles")
    public CommonResult<Boolean> assignRoles(@PathVariable("id") Long id,
                                             @Valid @RequestBody UserAssignRolesReqVO request) {
        LoginUser loginUser = requireTenantPermission(PERMISSION_ASSIGN_ROLE);
        systemUserAdminService.assignRoles(loginUser.getTenantId(), id, request.getRoleIds());
        return CommonResult.success(true);
    }

    private LoginUser requireTenantPermission(String permission) {
        LoginUser loginUser = SecurityFrameworkUtils.getLoginUser();
        authorizationService.requireTenantScope(loginUser);
        authorizationService.requirePermission(loginUser, permission);
        return loginUser;
    }
}
