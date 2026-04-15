package com.supermarket.erp.framework.security.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.Collections;
import java.util.Set;

@Data
@ConfigurationProperties(prefix = "erp.security")
public class SecurityProperties {

    /**
     * JWT signing secret key.
     */
    private String jwtSecret = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789AB";

    /**
     * JWT token expiration time in seconds.
     */
    private Integer jwtExpireSeconds = 86400;

    /**
     * URLs that are permitted without authentication.
     */
    private Set<String> permitAllUrls = Collections.emptySet();
}
