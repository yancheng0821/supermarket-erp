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
    void localProfile_shouldDisableNacosDiscoveryAndRouteSystemTrafficDirectly() throws IOException {
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
        assertThat(local.getProperty("spring.cloud.gateway.routes[0].id")).isEqualTo("erp-system-local");
        assertThat(local.getProperty("spring.cloud.gateway.routes[0].uri")).isEqualTo("http://localhost:8080");
        assertThat(local.getProperty("spring.cloud.gateway.routes[0].predicates[0]"))
                .isEqualTo("Path=/api/v1/admin/auth/**,/api/v1/admin/user/**,/api/v1/admin/role/**,/api/v1/admin/menu/**,/api/v1/admin/tenant/**");
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
