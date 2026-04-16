package com.supermarket.erp.framework.security.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.supermarket.erp.framework.security.core.JsonAccessDeniedHandler;
import com.supermarket.erp.framework.security.core.JsonAuthenticationEntryPoint;
import com.supermarket.erp.framework.security.core.TokenAuthenticationFilter;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.HashSet;
import java.util.Set;

@Configuration
@EnableWebSecurity
@EnableConfigurationProperties(SecurityProperties.class)
public class SecurityAutoConfiguration {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public TokenAuthenticationFilter tokenAuthenticationFilter(SecurityProperties securityProperties) {
        return new TokenAuthenticationFilter(securityProperties);
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint(ObjectMapper objectMapper) {
        return new JsonAuthenticationEntryPoint(objectMapper);
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler(ObjectMapper objectMapper) {
        return new JsonAccessDeniedHandler(objectMapper);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                    TokenAuthenticationFilter tokenAuthenticationFilter,
                                                    SecurityProperties securityProperties,
                                                    AuthenticationEntryPoint authenticationEntryPoint,
                                                    AccessDeniedHandler accessDeniedHandler) throws Exception {
        // Collect all permit-all URLs
        Set<String> permitAllUrls = new HashSet<>(securityProperties.getPermitAllUrls());
        permitAllUrls.add("/doc.html");
        permitAllUrls.add("/webjars/**");
        permitAllUrls.add("/swagger-resources/**");
        permitAllUrls.add("/v3/api-docs/**");

        http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                )
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(permitAllUrls.toArray(new String[0])).permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(tokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
