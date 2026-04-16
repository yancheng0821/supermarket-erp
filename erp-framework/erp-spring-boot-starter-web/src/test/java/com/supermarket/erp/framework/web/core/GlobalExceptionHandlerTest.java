package com.supermarket.erp.framework.web.core;

import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.pojo.CommonResult;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class GlobalExceptionHandlerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new TestController())
                .setControllerAdvice(new GlobalExceptionHandler())
                .addFilters(new WebRequestContextFilter())
                .build();
    }

    @Test
    void shouldMapHttpServiceExceptionToHttpStatus() throws Exception {
        mockMvc.perform(get("/service-http").header("X-Request-Id", "req-http"))
                .andExpect(status().isNotFound())
                .andExpect(header().string("X-Request-Id", "req-http"))
                .andExpect(jsonPath("$.code").value(404))
                .andExpect(jsonPath("$.msg").value("Tenant not found"));
    }

    @Test
    void shouldKeepBusinessServiceExceptionOnHttp200() throws Exception {
        mockMvc.perform(get("/service-business"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(900100))
                .andExpect(jsonPath("$.msg").value("Business failure"));
    }

    @Test
    void shouldReturnBadRequestForMalformedJson() throws Exception {
        mockMvc.perform(
                        post("/payload")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{bad")
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));
    }

    @Test
    void shouldReturnBadRequestForTypeMismatch() throws Exception {
        mockMvc.perform(get("/type").param("count", "abc"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));
    }

    @Test
    void shouldReturnInternalServerErrorForUnhandledException() throws Exception {
        mockMvc.perform(get("/explode"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.code").value(500))
                .andExpect(jsonPath("$.msg").value("Internal server error"));
    }

    @Validated
    @RestController
    static class TestController {

        @GetMapping("/service-http")
        CommonResult<String> serviceHttp() {
            throw new ServiceException(404, "Tenant not found");
        }

        @GetMapping("/service-business")
        CommonResult<String> serviceBusiness() {
            throw new ServiceException(900100, "Business failure");
        }

        @PostMapping("/payload")
        CommonResult<String> payload(@Valid @RequestBody Payload payload) {
            return CommonResult.success(payload.name());
        }

        @GetMapping("/type")
        CommonResult<Integer> type(@RequestParam("count") Integer count) {
            return CommonResult.success(count);
        }

        @GetMapping("/explode")
        CommonResult<String> explode() {
            throw new RuntimeException("boom");
        }
    }

    record Payload(@NotBlank String name) {
    }
}
