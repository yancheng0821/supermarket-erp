package com.supermarket.erp.module.system.controller.admin.auth;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.framework.security.util.SecurityFrameworkUtils;
import com.supermarket.erp.module.system.controller.admin.auth.vo.AuthSessionRespVO;
import com.supermarket.erp.module.system.controller.admin.auth.vo.PlatformLoginReqVO;
import com.supermarket.erp.module.system.controller.admin.auth.vo.TenantLoginReqVO;
import com.supermarket.erp.module.system.service.auth.AdminAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AdminAuthService adminAuthService;

    @PostMapping("/platform-login")
    public CommonResult<Map<String, Object>> platformLogin(@Valid @RequestBody PlatformLoginReqVO request) {
        return CommonResult.success(adminAuthService.platformLogin(request.getUsername(), request.getPassword()));
    }

    @PostMapping("/tenant-login")
    public CommonResult<Map<String, Object>> tenantLogin(@Valid @RequestBody TenantLoginReqVO request) {
        return CommonResult.success(adminAuthService.tenantLogin(
                request.getTenantCode(),
                request.getUsername(),
                request.getPassword()
        ));
    }

    @PostMapping("/login")
    public CommonResult<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        Map<String, Object> result = adminAuthService.login(request.getUsername(), request.getPassword());
        return CommonResult.success(result);
    }

    @GetMapping("/session")
    public CommonResult<AuthSessionRespVO> session() {
        return CommonResult.success(adminAuthService.getSession(SecurityFrameworkUtils.getLoginUser()));
    }

    public static class LoginRequest extends PlatformLoginReqVO {
    }
}
