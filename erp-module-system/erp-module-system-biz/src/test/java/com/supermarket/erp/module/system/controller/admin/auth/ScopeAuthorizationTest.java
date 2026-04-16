package com.supermarket.erp.module.system.controller.admin.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.supermarket.erp.framework.security.core.LoginScope;
import com.supermarket.erp.framework.security.core.LoginUser;
import com.supermarket.erp.framework.security.util.SecurityFrameworkUtils;
import com.supermarket.erp.framework.web.core.GlobalExceptionHandler;
import com.supermarket.erp.module.system.service.auth.AuthorizationService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.lang.reflect.Constructor;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;
import static org.mockito.Mockito.mockingDetails;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ScopeAuthorizationTest {

    private static final String TENANT_CONTROLLER = "com.supermarket.erp.module.system.controller.admin.tenant.TenantController";
    private static final String MENU_CONTROLLER = "com.supermarket.erp.module.system.controller.admin.menu.MenuController";
    private static final String USER_CONTROLLER = "com.supermarket.erp.module.system.controller.admin.user.UserController";
    private static final String ROLE_CONTROLLER = "com.supermarket.erp.module.system.controller.admin.role.RoleController";
    private static final String TENANT_SERVICE = "com.supermarket.erp.module.system.service.tenant.TenantAdminService";
    private static final String MENU_SERVICE = "com.supermarket.erp.module.system.service.menu.MenuAdminService";
    private static final String USER_SERVICE = "com.supermarket.erp.module.system.service.user.SystemUserAdminService";
    private static final String ROLE_SERVICE = "com.supermarket.erp.module.system.service.role.SystemRoleAdminService";

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Map<String, Object> serviceMocks = new HashMap<>();

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        Object tenantController = instantiateController(TENANT_CONTROLLER);
        Object menuController = instantiateController(MENU_CONTROLLER);
        Object userController = instantiateController(USER_CONTROLLER);
        Object roleController = instantiateController(ROLE_CONTROLLER);
        mockMvc = MockMvcBuilders.standaloneSetup(tenantController, menuController, userController, roleController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @AfterEach
    void tearDown() {
        SecurityFrameworkUtils.clearLoginUser();
    }

    @Test
    void platformLogin_shouldAllowPlatformTenantAndMenuApis() throws Exception {
        SecurityFrameworkUtils.setLoginUser(buildLoginUser(LoginScope.PLATFORM, null, Set.of(
                "platform:tenant:page",
                "platform:tenant:create",
                "platform:tenant:update",
                "platform:tenant:update-status",
                "platform:menu:tree",
                "platform:menu:create",
                "platform:menu:update"
        )));

        mockMvc.perform(get("/api/v1/admin/tenant/page")
                        .param("pageNo", "1")
                        .param("pageSize", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        mockMvc.perform(post("/api/v1/admin/tenant")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "code", "freshmart-bj",
                                "name", "Freshmart Beijing",
                                "contactName", "Alice",
                                "contactPhone", "13800000001",
                                "status", 0
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        mockMvc.perform(put("/api/v1/admin/tenant/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "code", "freshmart-bj",
                                "name", "Freshmart Beijing Updated",
                                "contactName", "Alice",
                                "contactPhone", "13800000001",
                                "status", 0
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        mockMvc.perform(put("/api/v1/admin/tenant/1/status")
                        .param("status", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        mockMvc.perform(get("/api/v1/admin/menu/tree")
                        .param("scope", "platform"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        mockMvc.perform(post("/api/v1/admin/menu")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "scope", "platform",
                                "name", "Tenant Management",
                                "permission", "platform:tenant:page",
                                "type", 2,
                                "parentId", 0,
                                "path", "/platform/tenants",
                                "component", "platform/tenants/index",
                                "icon", "building",
                                "sort", 10,
                                "status", 0
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        mockMvc.perform(put("/api/v1/admin/menu/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "scope", "platform",
                                "name", "Tenant Management",
                                "permission", "platform:tenant:update",
                                "type", 3,
                                "parentId", 0,
                                "path", "/platform/tenants",
                                "component", "platform/tenants/index",
                                "icon", "building",
                                "sort", 20,
                                "status", 0
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        assertThat(invokedMethodNames(TENANT_SERVICE))
                .contains("getTenantPage", "createTenant", "updateTenant", "updateTenantStatus");
        assertThat(invokedMethodNames(MENU_SERVICE))
                .contains("getMenuTree", "createMenu", "updateMenu");
    }

    @Test
    void tenantLogin_shouldBeRejectedByPlatformApis() throws Exception {
        SecurityFrameworkUtils.setLoginUser(buildLoginUser(LoginScope.TENANT, 1L, Set.of(
                "system:user:page",
                "system:role:page"
        )));

        mockMvc.perform(get("/api/v1/admin/tenant/page")
                        .param("pageNo", "1")
                        .param("pageSize", "10"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value(403))
                .andExpect(jsonPath("$.msg").value("Forbidden"));

        mockMvc.perform(get("/api/v1/admin/menu/tree")
                        .param("scope", "platform"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value(403))
                .andExpect(jsonPath("$.msg").value("Forbidden"));

        verifyNoInteractions(serviceMocks.get(TENANT_SERVICE), serviceMocks.get(MENU_SERVICE));
    }

    @Test
    void platformLogin_withoutRequiredPermission_shouldBeRejected() throws Exception {
        SecurityFrameworkUtils.setLoginUser(buildLoginUser(LoginScope.PLATFORM, null, Set.of(
                "platform:tenant:page"
        )));

        mockMvc.perform(post("/api/v1/admin/menu")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "scope", "platform",
                                "name", "Menu Admin",
                                "permission", "platform:menu:create",
                                "type", 3,
                                "parentId", 0,
                                "path", "/platform/menus",
                                "component", "platform/menus/index",
                                "icon", "shield",
                                "sort", 30,
                                "status", 0
                        ))))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value(403))
                .andExpect(jsonPath("$.msg").value("Forbidden"));

        verifyNoInteractions(serviceMocks.get(MENU_SERVICE));
    }

    @Test
    void tenantLogin_shouldAllowTenantUserAndRoleApis() throws Exception {
        SecurityFrameworkUtils.setLoginUser(buildLoginUser(LoginScope.TENANT, 1L, Set.of(
                "system:user:page",
                "system:user:create",
                "system:user:update",
                "system:user:update-status",
                "system:user:reset-password",
                "system:user:assign-role",
                "system:role:page",
                "system:role:create",
                "system:role:update",
                "system:role:update-status",
                "system:role:assign-menu"
        )));

        mockMvc.perform(get("/api/v1/admin/user/page")
                        .param("pageNo", "1")
                        .param("pageSize", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        mockMvc.perform(post("/api/v1/admin/user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", "cashier",
                                "password", "cashier123",
                                "nickname", "Cashier",
                                "phone", "13800000002",
                                "email", "cashier@example.com",
                                "status", 0
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        mockMvc.perform(put("/api/v1/admin/user/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", "cashier",
                                "nickname", "Front Cashier",
                                "phone", "13800000002",
                                "email", "cashier@example.com",
                                "status", 0
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        mockMvc.perform(put("/api/v1/admin/user/1/status")
                        .param("status", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        mockMvc.perform(put("/api/v1/admin/user/1/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("password", "new-password"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        mockMvc.perform(put("/api/v1/admin/user/1/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("roleIds", java.util.List.of(1, 2)))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        mockMvc.perform(get("/api/v1/admin/role/page")
                        .param("pageNo", "1")
                        .param("pageSize", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        mockMvc.perform(post("/api/v1/admin/role")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "name", "Store Manager",
                                "code", "store_manager",
                                "sort", 10,
                                "status", 0,
                                "remark", "Store manager role"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        mockMvc.perform(put("/api/v1/admin/role/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "name", "Store Manager",
                                "code", "store_manager",
                                "sort", 20,
                                "status", 0,
                                "remark", "Updated role"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        mockMvc.perform(put("/api/v1/admin/role/1/status")
                        .param("status", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        mockMvc.perform(put("/api/v1/admin/role/1/menus")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("menuIds", java.util.List.of(101, 102)))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));

        assertThat(invokedMethodNames(USER_SERVICE))
                .contains("getUserPage", "createUser", "updateUser", "updateUserStatus", "resetPassword", "assignRoles");
        assertThat(invokedMethodNames(ROLE_SERVICE))
                .contains("getRolePage", "createRole", "updateRole", "updateRoleStatus", "assignMenus");
    }

    @Test
    void platformLogin_shouldBeRejectedByTenantApis() throws Exception {
        SecurityFrameworkUtils.setLoginUser(buildLoginUser(LoginScope.PLATFORM, null, Set.of(
                "platform:tenant:page",
                "platform:menu:tree"
        )));

        mockMvc.perform(get("/api/v1/admin/user/page")
                        .param("pageNo", "1")
                        .param("pageSize", "10"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value(403))
                .andExpect(jsonPath("$.msg").value("Forbidden"));

        mockMvc.perform(get("/api/v1/admin/role/page")
                        .param("pageNo", "1")
                        .param("pageSize", "10"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value(403))
                .andExpect(jsonPath("$.msg").value("Forbidden"));

        verifyNoInteractions(serviceMocks.get(USER_SERVICE), serviceMocks.get(ROLE_SERVICE));
    }

    @Test
    void tenantLogin_withoutRequiredPermission_shouldBeRejectedByTenantApis() throws Exception {
        SecurityFrameworkUtils.setLoginUser(buildLoginUser(LoginScope.TENANT, 1L, Set.of(
                "system:user:page"
        )));

        mockMvc.perform(post("/api/v1/admin/role")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "name", "Store Manager",
                                "code", "store_manager",
                                "sort", 10,
                                "status", 0,
                                "remark", "Store manager role"
                        ))))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value(403))
                .andExpect(jsonPath("$.msg").value("Forbidden"));

        verifyNoInteractions(serviceMocks.get(ROLE_SERVICE));
    }

    private LoginUser buildLoginUser(LoginScope loginScope, Long tenantId, Set<String> permissions) {
        LoginUser loginUser = new LoginUser();
        loginUser.setUserId(1L);
        loginUser.setTenantId(tenantId);
        loginUser.setLoginScope(loginScope);
        loginUser.setPermissions(permissions);
        return loginUser;
    }

    private Object instantiateController(String controllerClassName) {
        try {
            Class<?> controllerClass = Class.forName(controllerClassName);
            Constructor<?> constructor = Arrays.stream(controllerClass.getDeclaredConstructors())
                    .findFirst()
                    .orElseThrow(() -> new IllegalStateException("No constructor found for " + controllerClassName));
            Object[] args = Arrays.stream(constructor.getParameterTypes())
                    .map(this::resolveDependency)
                    .toArray();
            constructor.setAccessible(true);
            return constructor.newInstance(args);
        } catch (ClassNotFoundException ex) {
            fail("Expected controller to exist: " + controllerClassName);
            return new Object();
        } catch (ReflectiveOperationException ex) {
            throw new IllegalStateException("Failed to instantiate controller " + controllerClassName, ex);
        }
    }

    private Object resolveDependency(Class<?> dependencyType) {
        if (dependencyType == AuthorizationService.class) {
            return new AuthorizationService();
        }
        return serviceMocks.computeIfAbsent(dependencyType.getName(), ignored -> Mockito.mock(dependencyType));
    }

    private Set<String> invokedMethodNames(String serviceClassName) {
        Object mock = serviceMocks.get(serviceClassName);
        if (mock == null) {
            fail("Expected service mock to exist: " + serviceClassName);
        }
        return mockingDetails(mock).getInvocations().stream()
                .map(invocation -> invocation.getMethod().getName())
                .collect(java.util.stream.Collectors.toSet());
    }
}
