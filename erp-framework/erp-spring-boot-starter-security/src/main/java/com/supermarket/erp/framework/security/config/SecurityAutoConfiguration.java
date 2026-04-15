package com.supermarket.erp.framework.security.config;

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
import org.springframework.security.web.SecurityFilterChain;
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
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                    TokenAuthenticationFilter tokenAuthenticationFilter,
                                                    SecurityProperties securityProperties) throws Exception {
        // Collect all permit-all URLs
        Set<String> permitAllUrls = new HashSet<>(securityProperties.getPermitAllUrls());
        permitAllUrls.add("/doc.html");
        permitAllUrls.add("/webjars/**");
        permitAllUrls.add("/swagger-resources/**");
        permitAllUrls.add("/v3/api-docs/**");

        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(permitAllUrls.toArray(new String[0])).permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(tokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
