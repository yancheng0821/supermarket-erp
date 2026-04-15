package com.supermarket.erp.framework.tenant.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.Collections;
import java.util.Set;

@Data
@ConfigurationProperties(prefix = "erp.tenant")
public class TenantProperties {

    /**
     * Whether tenant filtering is enabled.
     */
    private Boolean enable = true;

    /**
     * URLs that bypass tenant filtering.
     */
    private Set<String> ignoreUrls = Collections.emptySet();

    /**
     * Database tables that bypass tenant filtering.
     */
    private Set<String> ignoreTables = Collections.emptySet();
}
