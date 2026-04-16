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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Slf4j
@RequiredArgsConstructor
public class JsonAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException, ServletException {
        String requestId = resolveRequestId(request, response);
        if (requestId != null && !response.containsHeader(LogContextConstants.REQUEST_ID_HEADER)) {
            response.setHeader(LogContextConstants.REQUEST_ID_HEADER, requestId);
        }
        log.warn("access denied requestId={} method={} path={} detail={}",
                requestId,
                request.getMethod(),
                request.getRequestURI(),
                accessDeniedException.getMessage());
        writeBody(response, HttpServletResponse.SC_FORBIDDEN, CommonResult.error(403, "Forbidden"));
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
