package com.supermarket.erp.framework.web.core;

import com.supermarket.erp.common.exception.ServiceException;
import com.supermarket.erp.common.logging.LogContextConstants;
import com.supermarket.erp.common.pojo.CommonResult;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<CommonResult<?>> handleServiceException(ServiceException ex) {
        CommonResult<?> body = CommonResult.error(ex.getCode(), ex.getMessage());
        HttpStatus status = resolveHttpStatus(ex.getCode());
        logServiceException(ex, status);
        if (status == null) {
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<CommonResult<?>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        FieldError fieldError = ex.getBindingResult().getFieldError();
        String message = fieldError != null ? fieldError.getDefaultMessage() : "Validation failed";
        logClientException("validation failed", ex);
        return ResponseEntity.badRequest().body(CommonResult.error(400, message));
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<CommonResult<?>> handleBindException(BindException ex) {
        FieldError fieldError = ex.getBindingResult().getFieldError();
        String message = fieldError != null ? fieldError.getDefaultMessage() : "Binding failed";
        logClientException("binding failed", ex);
        return ResponseEntity.badRequest().body(CommonResult.error(400, message));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<CommonResult<?>> handleConstraintViolationException(ConstraintViolationException ex) {
        String message = ex.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining(", "));
        logClientException("constraint violation", ex);
        return ResponseEntity.badRequest().body(CommonResult.error(400, message));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<CommonResult<?>> handleMethodArgumentTypeMismatchException(
            MethodArgumentTypeMismatchException ex) {
        String message = ex.getName() != null
                ? String.format("Invalid value for parameter '%s'", ex.getName())
                : "Invalid request parameter";
        logClientException("request parameter type mismatch", ex);
        return ResponseEntity.badRequest().body(CommonResult.error(400, message));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<CommonResult<?>> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        logClientException("invalid request payload", ex);
        return ResponseEntity.badRequest().body(CommonResult.error(400, "Invalid request payload"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResult<?>> handleException(Exception ex) {
        log.error("unexpected exception requestId={} method={} path={}",
                MDC.get(LogContextConstants.REQUEST_ID),
                MDC.get(LogContextConstants.METHOD),
                MDC.get(LogContextConstants.PATH),
                ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(CommonResult.error(500, "Internal server error"));
    }

    private void logServiceException(ServiceException ex, HttpStatus status) {
        if (status != null && status.is5xxServerError()) {
            log.error("service exception code={} msg={} requestId={} method={} path={}",
                    ex.getCode(),
                    ex.getMessage(),
                    MDC.get(LogContextConstants.REQUEST_ID),
                    MDC.get(LogContextConstants.METHOD),
                    MDC.get(LogContextConstants.PATH),
                    ex);
            return;
        }
        log.warn("service exception code={} msg={} requestId={} method={} path={}",
                ex.getCode(),
                ex.getMessage(),
                MDC.get(LogContextConstants.REQUEST_ID),
                MDC.get(LogContextConstants.METHOD),
                MDC.get(LogContextConstants.PATH));
    }

    private void logClientException(String summary, Exception ex) {
        log.warn("{} requestId={} method={} path={} detail={}",
                summary,
                MDC.get(LogContextConstants.REQUEST_ID),
                MDC.get(LogContextConstants.METHOD),
                MDC.get(LogContextConstants.PATH),
                ex.getMessage());
    }

    private HttpStatus resolveHttpStatus(Integer code) {
        if (code == null) {
            return null;
        }
        if (code >= 400 && code < 600) {
            return HttpStatus.valueOf(code);
        }
        return null;
    }
}
