package com.supermarket.erp.module.system.controller.admin.auth;

import com.supermarket.erp.common.exception.ServiceException;
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

@WebMvcTest(controllers = GlobalExceptionResponseTest.ExceptionController.class)
@Import({
        SecurityAutoConfiguration.class,
        WebAutoConfiguration.class,
        GlobalExceptionResponseTest.ExceptionController.class
})
@TestPropertySource(properties = {
        "erp.security.jwt-secret=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789AB",
        "erp.security.permit-all-urls=/service-http,/explode",
        "spring.cloud.nacos.config.import-check.enabled=false"
})
class GlobalExceptionResponseTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void serviceExceptionShouldKeepRequestIdAndMappedStatus() throws Exception {
        mockMvc.perform(get("/service-http").header("X-Request-Id", "req-404"))
                .andExpect(status().isNotFound())
                .andExpect(header().string("X-Request-Id", "req-404"))
                .andExpect(jsonPath("$.code").value(404))
                .andExpect(jsonPath("$.msg").value("Tenant not found"));
    }

    @Test
    void runtimeExceptionShouldKeepRequestIdAndReturnInternalServerError() throws Exception {
        mockMvc.perform(get("/explode").header("X-Request-Id", "req-500"))
                .andExpect(status().isInternalServerError())
                .andExpect(header().string("X-Request-Id", "req-500"))
                .andExpect(jsonPath("$.code").value(500))
                .andExpect(jsonPath("$.msg").value("Internal server error"));
    }

    @RestController
    static class ExceptionController {

        @GetMapping("/service-http")
        CommonResult<String> serviceHttp() {
            throw new ServiceException(404, "Tenant not found");
        }

        @GetMapping("/explode")
        CommonResult<String> explode() {
            throw new RuntimeException("boom");
        }
    }

    @SpringBootConfiguration
    @EnableAutoConfiguration
    static class TestConfiguration {
    }
}
