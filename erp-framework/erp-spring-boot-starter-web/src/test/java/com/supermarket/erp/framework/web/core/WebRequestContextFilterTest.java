package com.supermarket.erp.framework.web.core;

import com.supermarket.erp.common.pojo.CommonResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class WebRequestContextFilterTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new TestController())
                .addFilters(new WebRequestContextFilter())
                .build();
    }

    @Test
    void shouldGenerateRequestIdWhenHeaderMissing() throws Exception {
        mockMvc.perform(get("/test"))
                .andExpect(status().isOk())
                .andExpect(header().exists("X-Request-Id"));
    }

    @Test
    void shouldEchoIncomingRequestId() throws Exception {
        mockMvc.perform(get("/test").header("X-Request-Id", "req-123"))
                .andExpect(status().isOk())
                .andExpect(header().string("X-Request-Id", "req-123"));
    }

    @RestController
    static class TestController {

        @GetMapping("/test")
        CommonResult<String> test() {
            return CommonResult.success("ok");
        }
    }
}
