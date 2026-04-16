package com.supermarket.erp.gateway.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.bind.Bindable;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.cloud.gateway.config.GatewayProperties;
import org.springframework.cloud.gateway.handler.predicate.PredicateDefinition;
import org.springframework.cloud.gateway.route.RouteDefinition;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class GatewayRouteMatchingTest {

    private final YamlPropertySourceLoader yamlLoader = new YamlPropertySourceLoader();

    @Test
    void systemRouteShortcutPredicate_shouldBindAllAdminPatterns() throws IOException {
        GatewayProperties base = bindGatewayProperties("application.yml");
        GatewayProperties local = bindGatewayProperties("application-local.yml");

        assertThat(extractPathPatterns(base, "erp-system"))
                .containsExactly(
                        "/api/v1/admin/auth/**",
                        "/api/v1/admin/user/**",
                        "/api/v1/admin/role/**",
                        "/api/v1/admin/menu/**",
                        "/api/v1/admin/tenant/**");

        assertThat(extractPathPatterns(local, "erp-system-local"))
                .containsExactly(
                        "/api/v1/admin/auth/**",
                        "/api/v1/admin/user/**",
                        "/api/v1/admin/role/**",
                        "/api/v1/admin/menu/**",
                        "/api/v1/admin/tenant/**");
    }

    private GatewayProperties bindGatewayProperties(String path) throws IOException {
        ConfigurableEnvironment environment = new StandardEnvironment();
        List<PropertySource<?>> sources = yamlLoader.load(path, new ClassPathResource(path));
        for (PropertySource<?> source : sources) {
            environment.getPropertySources().addFirst(source);
        }

        return Binder.get(environment)
                .bind("spring.cloud.gateway", Bindable.of(GatewayProperties.class))
                .orElseThrow(() -> new IllegalStateException("Failed to bind gateway properties from " + path));
    }

    private List<String> extractPathPatterns(GatewayProperties properties, String routeId) {
        RouteDefinition route = properties.getRoutes().stream()
                .filter(candidate -> routeId.equals(candidate.getId()))
                .findFirst()
                .orElseThrow();

        PredicateDefinition predicate = route.getPredicates().stream()
                .filter(candidate -> "Path".equals(candidate.getName()))
                .findFirst()
                .orElseThrow();

        return new ArrayList<>(predicate.getArgs().values());
    }
}
