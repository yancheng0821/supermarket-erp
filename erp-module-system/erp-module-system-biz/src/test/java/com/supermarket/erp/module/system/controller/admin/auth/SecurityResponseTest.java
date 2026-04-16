package com.supermarket.erp.module.system.controller.admin.auth;

import com.supermarket.erp.common.pojo.CommonResult;
import com.supermarket.erp.framework.security.config.SecurityAutoConfiguration;
import com.supermarket.erp.framework.web.config.WebAutoConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = SecurityResponseTest.ProtectedController.class)
@Import({SecurityAutoConfiguration.class, WebAutoConfiguration.class})
@TestPropertySource(properties = {
        "erp.security.jwt-secret=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789AB",
        "erp.security.permit-all-urls=/public",
        "spring.cloud.nacos.config.import-check.enabled=false"
})
class SecurityResponseTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void protectedEndpoint_shouldReturnJsonUnauthorizedWhenTokenMissing() throws Exception {
        mockMvc.perform(get("/protected").header("X-Request-Id", "req-auth"))
                .andExpect(status().isUnauthorized())
                .andExpect(header().string("X-Request-Id", "req-auth"))
                .andExpect(jsonPath("$.code").value(401))
                .andExpect(jsonPath("$.msg").value("Unauthorized"));
    }

    @RestController
    static class ProtectedController {

        @GetMapping("/protected")
        CommonResult<String> protectedEndpoint() {
            return CommonResult.success("ok");
        }
    }

    @SpringBootConfiguration
    @EnableAutoConfiguration
    static class TestConfiguration {
    }
}
