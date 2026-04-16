package com.supermarket.erp.framework.security.core;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.supermarket.erp.common.logging.LogContextConstants;
import com.supermarket.erp.common.pojo.CommonResult;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Slf4j
@RequiredArgsConstructor
public class JsonAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        String requestId = resolveRequestId(request, response);
        if (requestId != null && !response.containsHeader(LogContextConstants.REQUEST_ID_HEADER)) {
            response.setHeader(LogContextConstants.REQUEST_ID_HEADER, requestId);
        }
        log.warn("authentication failed requestId={} method={} path={} detail={}",
                requestId,
                request.getMethod(),
                request.getRequestURI(),
                authException.getMessage());
        writeBody(response, HttpServletResponse.SC_UNAUTHORIZED, CommonResult.error(401, "Unauthorized"));
    }

    private void writeBody(HttpServletResponse response, int status, CommonResult<?> body) throws IOException {
        response.setStatus(status);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getWriter(), body);
    }

    private String resolveRequestId(HttpServletRequest request, HttpServletResponse response) {
        String requestId = response.getHeader(LogContextConstants.REQUEST_ID_HEADER);
        if (requestId != null) {
            return requestId;
        }
        requestId = MDC.get(LogContextConstants.REQUEST_ID);
        if (requestId != null) {
            return requestId;
        }
        return request.getHeader(LogContextConstants.REQUEST_ID_HEADER);
    }
}
