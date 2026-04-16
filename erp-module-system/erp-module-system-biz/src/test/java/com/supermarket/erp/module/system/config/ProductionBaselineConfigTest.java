package com.supermarket.erp.module.system.config;

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

class ProductionBaselineConfigTest {

    private final YamlPropertySourceLoader yamlLoader = new YamlPropertySourceLoader();

    @Test
    void systemProfileFiles_shouldExistAndExposeHealthEndpoint() throws IOException {
        assertThat(new ClassPathResource("application-local.yml").exists()).isTrue();
        assertThat(new ClassPathResource("application-dev.yml").exists()).isTrue();
        assertThat(new ClassPathResource("application-prod.yml").exists()).isTrue();
        assertThat(new ClassPathResource("logback-spring.xml").exists()).isTrue();

        CompositePropertySource base = loadYaml("application.yml");
        assertThat(base.getProperty("management.endpoints.web.exposure.include")).isEqualTo("health,info");
        assertThat(base.getProperty("management.endpoint.health.show-details")).isEqualTo("never");
        assertThat(base.getProperty("logging.file.path")).isEqualTo("${ERP_SYSTEM_LOG_PATH:./logs/erp-system}");
        assertThat(base.getProperty("erp.security.permit-all-urls[3]")).isEqualTo("/actuator/health");
        assertThat(base.getProperty("erp.security.permit-all-urls[4]")).isEqualTo("/actuator/info");
    }

    @Test
    void systemLocalProfile_shouldDisableNacosDiscoveryForStandaloneRun() throws IOException {
        CompositePropertySource local = loadYaml("application-local.yml");

        assertThat(local.getProperty("spring.cloud.discovery.enabled")).isEqualTo(false);
        assertThat(local.getProperty("spring.cloud.service-registry.auto-registration.enabled")).isEqualTo(false);
        assertThat(local.getProperty("spring.cloud.nacos.discovery.enabled")).isEqualTo(false);
        assertThat(local.getProperty("spring.cloud.nacos.discovery.register-enabled")).isEqualTo(false);
        assertThat(local.getProperty("spring.cloud.nacos.config.enabled")).isEqualTo(false);
    }

    @Test
    void systemLogback_shouldSeparateAccessAndAsyncFileAppenders() throws IOException {
        String logback = readTextResource("logback-spring.xml");

        assertThat(logback).contains("<appender name=\"APP_FILE\"");
        assertThat(logback).contains("<appender name=\"ERROR_FILE\"");
        assertThat(logback).contains("<appender name=\"ACCESS_FILE\"");
        assertThat(logback).contains("<file>${LOG_PATH}/access.log</file>");
        assertThat(logback).contains("<appender name=\"ASYNC_APP\"");
        assertThat(logback).contains("<appender name=\"ASYNC_ERROR\"");
        assertThat(logback).contains("<appender name=\"ASYNC_ACCESS\"");
        assertThat(logback).contains("<logger name=\"com.supermarket.erp.framework.web.core.WebRequestContextFilter\"");
        assertThat(logback).contains("additivity=\"false\"");
        assertThat(logback).contains("<appender-ref ref=\"ASYNC_APP\"/>");
        assertThat(logback).contains("<appender-ref ref=\"ASYNC_ERROR\"/>");
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
