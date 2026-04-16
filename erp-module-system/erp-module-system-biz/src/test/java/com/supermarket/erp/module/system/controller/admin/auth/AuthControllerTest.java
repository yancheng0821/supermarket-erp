package com.supermarket.erp.module.system.controller.admin.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.framework.security.core.LoginScope;
import com.supermarket.erp.framework.security.core.LoginUser;
import com.supermarket.erp.framework.security.util.SecurityFrameworkUtils;
import com.supermarket.erp.framework.web.core.GlobalExceptionHandler;
import com.supermarket.erp.module.system.controller.admin.auth.vo.AuthMenuRespVO;
import com.supermarket.erp.module.system.controller.admin.auth.vo.AuthSessionRespVO;
import com.supermarket.erp.module.system.service.auth.AdminAuthService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

import static org.hamcrest.Matchers.anyOf;
import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthControllerTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private StubAdminAuthService adminAuthService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        adminAuthService = new StubAdminAuthService();
        mockMvc = MockMvcBuilders.standaloneSetup(new AuthController(adminAuthService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityFrameworkUtils.clearLoginUser();
    }

    @Test
    void platformLogin_shouldReturnTokenPayload() throws Exception {
        adminAuthService.platformLoginHandler = ignored -> Map.of(
                "token", "platform-token",
                "userId", 1L,
                "nickname", "Platform Admin",
                "loginScope", "platform"
        );

        mockMvc.perform(post("/api/v1/admin/auth/platform-login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "platform-admin",
                                  "password": "admin123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.token").value("platform-token"))
                .andExpect(jsonPath("$.data.loginScope").value("platform"));
    }

    @Test
    void tenantLogin_shouldReturnBusinessErrorForBadCredentials() throws Exception {
        adminAuthService.tenantLoginHandler = ignored -> {
            throw new ServiceException(1001, "Invalid username or password");
        };

        mockMvc.perform(post("/api/v1/admin/auth/tenant-login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "tenantCode": "freshmart-sh",
                                  "username": "store-admin",
                                  "password": "wrong-password"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1001))
                .andExpect(jsonPath("$.msg").value("Invalid username or password"));
    }

    @Test
    void platformLogin_shouldReturnBusinessErrorForDisabledAccount() throws Exception {
        adminAuthService.platformLoginHandler = ignored -> {
            throw new ServiceException(1002, "User account is disabled");
        };

        mockMvc.perform(post("/api/v1/admin/auth/platform-login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "platform-admin",
                                  "password": "admin123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1002))
                .andExpect(jsonPath("$.msg").value("User account is disabled"));
    }

    @Test
    void session_shouldReturnCurrentUserMenuAndPermissions() throws Exception {
        LoginUser loginUser = new LoginUser();
        loginUser.setUserId(300L);
        loginUser.setTenantId(200L);
        loginUser.setLoginScope(LoginScope.TENANT);
        loginUser.setPermissions(Set.of("system:user:create"));
        SecurityFrameworkUtils.setLoginUser(loginUser);

        AuthMenuRespVO usersMenu = new AuthMenuRespVO();
        usersMenu.setId(10L);
        usersMenu.setName("Users");
        usersMenu.setPath("/system/users");
        usersMenu.setPermission("system:user:page");
        usersMenu.setChildren(List.of());

        AuthSessionRespVO.UserInfo userInfo = new AuthSessionRespVO.UserInfo();
        userInfo.setUserId(300L);
        userInfo.setNickname("Store Admin");
        userInfo.setUsername("store-admin");

        AuthSessionRespVO.TenantInfo tenantInfo = new AuthSessionRespVO.TenantInfo();
        tenantInfo.setTenantId(200L);
        tenantInfo.setTenantCode("freshmart-sh");
        tenantInfo.setTenantName("Freshmart Shanghai");

        AuthSessionRespVO session = new AuthSessionRespVO();
        session.setLoginScope("tenant");
        session.setUser(userInfo);
        session.setTenant(tenantInfo);
        session.setPermissions(Set.of("system:user:create"));
        session.setMenus(List.of(usersMenu));

        adminAuthService.sessionHandler = ignored -> session;

        mockMvc.perform(get("/api/v1/admin/auth/session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.loginScope").value("tenant"))
                .andExpect(jsonPath("$.data.user.userId").value(300))
                .andExpect(jsonPath("$.data.tenant.tenantCode").value("freshmart-sh"))
                .andExpect(jsonPath("$.data.menus[0].path").value("/system/users"))
                .andExpect(jsonPath("$.data.permissions[0]").value("system:user:create"));

        org.assertj.core.api.Assertions.assertThat(adminAuthService.lastSessionLoginUser).isNotNull();
        org.assertj.core.api.Assertions.assertThat(adminAuthService.lastSessionLoginUser.getUserId()).isEqualTo(300L);
    }

    @Test
    void platformLogin_shouldReturnBadRequestForInvalidPayload() throws Exception {
        mockMvc.perform(post("/api/v1/admin/auth/platform-login")
                        .contentType(MediaType.APPLICATION_JSON)
                .content("""
                                {
                                  "username": "",
                                  "password": ""
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.msg").value(anyOf(
                        equalTo("Username must not be blank"),
                        equalTo("Password must not be blank")
                )));
    }

    private static final class StubAdminAuthService extends AdminAuthService {

        private Function<LoginRequest, Map<String, Object>> platformLoginHandler = ignored -> Map.of();
        private Function<TenantLoginRequest, Map<String, Object>> tenantLoginHandler = ignored -> Map.of();
        private Function<LoginUser, AuthSessionRespVO> sessionHandler = ignored -> null;
        private LoginUser lastSessionLoginUser;

        private StubAdminAuthService() {
            super(null, null, null, null, null, null, null);
        }

        @Override
        public Map<String, Object> platformLogin(String username, String password) {
            return platformLoginHandler.apply(new LoginRequest(username, password));
        }

        @Override
        public Map<String, Object> tenantLogin(String tenantCode, String username, String password) {
            return tenantLoginHandler.apply(new TenantLoginRequest(tenantCode, username, password));
        }

        @Override
        public AuthSessionRespVO getSession(LoginUser loginUser) {
            lastSessionLoginUser = loginUser;
            return sessionHandler.apply(loginUser);
        }

        private record LoginRequest(String username, String password) {
        }

        private record TenantLoginRequest(String tenantCode, String username, String password) {
        }
    }
}
