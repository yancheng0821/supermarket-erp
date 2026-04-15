package com.supermarket.erp.module.system.controller.admin.auth;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.module.system.service.auth.AdminAuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
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

    @PostMapping("/login")
    public CommonResult<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        Map<String, Object> result = adminAuthService.login(request.getUsername(), request.getPassword());
        return CommonResult.success(result);
    }

    @Data
    public static class LoginRequest {
        @NotBlank(message = "Username must not be blank")
        private String username;
        @NotBlank(message = "Password must not be blank")
        private String password;
    }
}
