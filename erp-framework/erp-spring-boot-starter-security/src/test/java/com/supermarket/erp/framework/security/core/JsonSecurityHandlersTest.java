package com.supermarket.erp.framework.security.core;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.InsufficientAuthenticationException;

import static org.assertj.core.api.Assertions.assertThat;

class JsonSecurityHandlersTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void authenticationEntryPointShouldWriteUnauthorizedBody() throws Exception {
        JsonAuthenticationEntryPoint entryPoint = new JsonAuthenticationEntryPoint(objectMapper);
        MockHttpServletResponse response = new MockHttpServletResponse();

        entryPoint.commence(
                new MockHttpServletRequest(),
                response,
                new InsufficientAuthenticationException("Missing token"));

        JsonNode body = objectMapper.readTree(response.getContentAsString());
        assertThat(response.getStatus()).isEqualTo(401);
        assertThat(body.get("code").asInt()).isEqualTo(401);
        assertThat(body.get("msg").asText()).isEqualTo("Unauthorized");
    }

    @Test
    void accessDeniedHandlerShouldWriteForbiddenBody() throws Exception {
        JsonAccessDeniedHandler handler = new JsonAccessDeniedHandler(objectMapper);
        MockHttpServletResponse response = new MockHttpServletResponse();

        handler.handle(
                new MockHttpServletRequest(),
                response,
                new AccessDeniedException("No permission"));

        JsonNode body = objectMapper.readTree(response.getContentAsString());
        assertThat(response.getStatus()).isEqualTo(403);
        assertThat(body.get("code").asInt()).isEqualTo(403);
        assertThat(body.get("msg").asText()).isEqualTo("Forbidden");
    }
}
