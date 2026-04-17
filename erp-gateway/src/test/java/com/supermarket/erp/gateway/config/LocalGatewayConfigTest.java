package com.supermarket.erp.gateway.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.core.env.CompositePropertySource;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class LocalGatewayConfigTest {

    private final YamlPropertySourceLoader yamlLoader = new YamlPropertySourceLoader();

    @Test
    void gatewayRoutePredicates_shouldNotContainLeadingSpacesAfterCommas() throws IOException {
        CompositePropertySource base = loadYaml("application.yml");
        CompositePropertySource local = loadYaml("application-local.yml");

        assertPathPredicate(base.getProperty("spring.cloud.gateway.routes[0].predicates[0]"));
        assertPathPredicate(local.getProperty("spring.cloud.gateway.routes[0].predicates[0]"));
    }

    @Test
    void localProfile_shouldDisableNacosDiscoveryAndRouteAllModuleTrafficDirectly() throws IOException {
        assertThat(new ClassPathResource("application-local.yml").exists()).isTrue();
        assertThat(new ClassPathResource("logback-spring.xml").exists()).isTrue();

        CompositePropertySource local = loadYaml("application-local.yml");
        CompositePropertySource base = loadYaml("application.yml");

        assertThat(local.getProperty("spring.cloud.discovery.enabled")).isEqualTo(false);
        assertThat(local.getProperty("spring.cloud.service-registry.auto-registration.enabled")).isEqualTo(false);
        assertThat(local.getProperty("spring.cloud.nacos.discovery.enabled")).isEqualTo(false);
        assertThat(local.getProperty("spring.cloud.nacos.discovery.register-enabled")).isEqualTo(false);
        assertThat(local.getProperty("spring.cloud.nacos.config.enabled")).isEqualTo(false);
        assertThat(base.getProperty("logging.file.path")).isEqualTo("${ERP_GATEWAY_LOG_PATH:./logs/erp-gateway}");
        assertRoute(local, 0, "erp-system-local", "http://localhost:${SYSTEM_PORT:8080}",
                "Path=/api/v1/admin/auth/**,/api/v1/admin/user/**,/api/v1/admin/role/**,/api/v1/admin/menu/**,/api/v1/admin/tenant/**");
        assertRoute(local, 1, "erp-archive-local", "http://localhost:${ARCHIVE_PORT:8081}",
                "Path=/api/v1/admin/archive/**");
        assertRoute(local, 2, "erp-inventory-local", "http://localhost:${INVENTORY_PORT:8082}",
                "Path=/api/v1/admin/inventory/**");
        assertRoute(local, 3, "erp-purchase-local", "http://localhost:${PURCHASE_PORT:8083}",
                "Path=/api/v1/admin/purchase/**");
        assertRoute(local, 4, "erp-operation-local", "http://localhost:${OPERATION_PORT:8084}",
                "Path=/api/v1/admin/operation/**");
        assertRoute(local, 5, "erp-member-local", "http://localhost:${MEMBER_PORT:8085}",
                "Path=/api/v1/admin/member/**");
        assertRoute(local, 6, "erp-online-admin-local", "http://localhost:${ONLINE_PORT:8086}",
                "Path=/api/v1/admin/online/**");
        assertRoute(local, 7, "erp-online-app-local", "http://localhost:${ONLINE_PORT:8086}",
                "Path=/api/v1/app/online/**");
        assertRoute(local, 8, "erp-finance-local", "http://localhost:${FINANCE_PORT:8087}",
                "Path=/api/v1/admin/finance/**");
        assertRoute(local, 9, "erp-analytics-local", "http://localhost:${ANALYTICS_PORT:8088}",
                "Path=/api/v1/admin/analytics/**");
        assertThat(local.getProperty("spring.cloud.gateway.routes[10].id")).isNull();
    }

    @Test
    void gatewayLogback_shouldSeparateAccessAndAsyncFileAppenders() throws IOException {
        String logback = readTextResource("logback-spring.xml");

        assertThat(logback).contains("<appender name=\"APP_FILE\"");
        assertThat(logback).contains("<appender name=\"ERROR_FILE\"");
        assertThat(logback).contains("<appender name=\"ACCESS_FILE\"");
        assertThat(logback).contains("<file>${LOG_PATH}/access.log</file>");
        assertThat(logback).contains("<appender name=\"ASYNC_APP\"");
        assertThat(logback).contains("<appender name=\"ASYNC_ERROR\"");
        assertThat(logback).contains("<appender name=\"ASYNC_ACCESS\"");
        assertThat(logback).contains("<logger name=\"com.supermarket.erp.gateway.filter.RequestCorrelationGlobalFilter\"");
        assertThat(logback).contains("additivity=\"false\"");
        assertThat(logback).contains("<appender-ref ref=\"ASYNC_APP\"/>");
        assertThat(logback).contains("<appender-ref ref=\"ASYNC_ERROR\"/>");
    }

    private void assertPathPredicate(Object predicate) {
        assertThat(predicate)
                .isEqualTo("Path=/api/v1/admin/auth/**,/api/v1/admin/user/**,/api/v1/admin/role/**,/api/v1/admin/menu/**,/api/v1/admin/tenant/**");
        assertThat(predicate.toString()).doesNotContain(", ");
    }

    private void assertRoute(CompositePropertySource propertySource, int index, String id, String uri, String predicate) {
        assertThat(propertySource.getProperty("spring.cloud.gateway.routes[" + index + "].id")).isEqualTo(id);
        assertThat(propertySource.getProperty("spring.cloud.gateway.routes[" + index + "].uri")).isEqualTo(uri);
        assertThat(propertySource.getProperty("spring.cloud.gateway.routes[" + index + "].predicates[0]")).isEqualTo(predicate);
        assertThat(propertySource.getProperty("spring.cloud.gateway.routes[" + index + "].predicates[0]").toString())
                .doesNotContain(", ");
    }

    private CompositePropertySource loadYaml(String path) throws IOException {
        CompositePropertySource propertySource = new CompositePropertySource(path);
        List<PropertySource<?>> loaded = yamlLoader.load(path, new ClassPathResource(path));
        for (PropertySource<?> source : loaded) {
            propertySource.addPropertySource(source);
        }
        return propertySource;
    }

    private String readTextResource(String path) throws IOException {
        return StreamUtils.copyToString(new ClassPathResource(path).getInputStream(), StandardCharsets.UTF_8);
    }
}
