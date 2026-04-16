package com.supermarket.erp.framework.security.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.util.Collections;
import java.util.Set;

@Data
@Validated
@ConfigurationProperties(prefix = "erp.security")
public class SecurityProperties {

    /**
     * JWT signing secret key.
     */
    @NotBlank(message = "erp.security.jwt-secret must not be blank")
    @Size(min = 32, message = "erp.security.jwt-secret must be at least 32 characters")
    private String jwtSecret;

    /**
     * JWT token expiration time in seconds.
     */
    private Integer jwtExpireSeconds = 86400;

    /**
     * URLs that are permitted without authentication.
     */
    private Set<String> permitAllUrls = Collections.emptySet();
}
