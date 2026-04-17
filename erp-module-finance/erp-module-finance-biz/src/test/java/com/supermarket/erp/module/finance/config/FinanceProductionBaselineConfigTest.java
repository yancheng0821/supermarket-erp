package com.supermarket.erp.module.finance.config;

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

class FinanceProductionBaselineConfigTest {

    private final YamlPropertySourceLoader yamlLoader = new YamlPropertySourceLoader();

    @Test
    void financeProfileFiles_shouldExposeProductionBaseline() throws IOException {
        assertThat(new ClassPathResource("application-local.yml").exists()).isTrue();
        assertThat(new ClassPathResource("application-dev.yml").exists()).isTrue();
        assertThat(new ClassPathResource("application-prod.yml").exists()).isTrue();
        assertThat(new ClassPathResource("logback-spring.xml").exists()).isTrue();

        CompositePropertySource base = loadYaml("application.yml");

        assertThat(base.getProperty("spring.application.name")).isEqualTo("erp-finance");
        assertThat(base.getProperty("spring.profiles.default")).isEqualTo("local");
        assertThat(base.getProperty("erp.security.jwt-secret")).isEqualTo("${ERP_JWT_SECRET:}");
        assertThat(base.getProperty("management.endpoints.web.exposure.include")).isEqualTo("health,info");
        assertThat(base.getProperty("management.endpoint.health.show-details")).isEqualTo("never");
        assertThat(base.getProperty("logging.file.path")).isEqualTo("${ERP_FINANCE_LOG_PATH:./logs/erp-finance}");
        assertThat(base.getProperty("erp.security.permit-all-urls[0]")).isEqualTo("/actuator/health");
        assertThat(base.getProperty("erp.security.permit-all-urls[1]")).isEqualTo("/actuator/info");
        assertThat(base.getProperty("erp.security.permit-all-urls[2]")).isNull();
    }

    @Test
    void financeLocalProfile_shouldDisableNacosAndExternalizeDatasourceSecrets() throws IOException {
        CompositePropertySource local = loadYaml("application-local.yml");
        CompositePropertySource dev = loadYaml("application-dev.yml");
        CompositePropertySource prod = loadYaml("application-prod.yml");

        assertThat(local.getProperty("spring.cloud.discovery.enabled")).isEqualTo(false);
        assertThat(local.getProperty("spring.cloud.service-registry.auto-registration.enabled")).isEqualTo(false);
        assertThat(local.getProperty("spring.cloud.nacos.discovery.enabled")).isEqualTo(false);
        assertThat(local.getProperty("spring.cloud.nacos.discovery.register-enabled")).isEqualTo(false);
        assertThat(local.getProperty("spring.cloud.nacos.config.enabled")).isEqualTo(false);
        assertThat(local.getProperty("spring.datasource.password")).isEqualTo("${ERP_DB_PASSWORD:}");
        assertThat(dev.getProperty("spring.datasource.password")).isEqualTo("${ERP_DB_PASSWORD:}");
        assertThat(prod.getProperty("spring.datasource.password")).isEqualTo("${ERP_DB_PASSWORD}");
    }

    @Test
    void financeLogback_shouldSeparateAccessAndAsyncFileAppenders() throws IOException {
        String logback = readTextResource("logback-spring.xml");

        assertThat(logback).contains("<springProperty scope=\"context\" name=\"APP_NAME\" source=\"spring.application.name\" defaultValue=\"erp-finance\"/>");
        assertThat(logback).contains("<appender name=\"APP_FILE\"");
        assertThat(logback).contains("<appender name=\"ERROR_FILE\"");
        assertThat(logback).contains("<appender name=\"ACCESS_FILE\"");
        assertThat(logback).contains("<file>${LOG_PATH}/access.log</file>");
        assertThat(logback).contains("<appender name=\"ASYNC_APP\"");
        assertThat(logback).contains("<appender name=\"ASYNC_ERROR\"");
        assertThat(logback).contains("<appender name=\"ASYNC_ACCESS\"");
        assertThat(logback).contains("<logger name=\"com.supermarket.erp.framework.web.core.WebRequestContextFilter\"");
        assertThat(logback).contains("additivity=\"false\"");
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
