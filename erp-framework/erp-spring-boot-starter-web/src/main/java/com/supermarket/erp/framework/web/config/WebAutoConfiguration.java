package com.supermarket.erp.framework.web.config;

import com.supermarket.erp.framework.web.core.GlobalExceptionHandler;
import com.supermarket.erp.framework.web.core.WebRequestContextFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@Import(GlobalExceptionHandler.class)
public class WebAutoConfiguration implements WebMvcConfigurer {

    @Bean
    public FilterRegistrationBean<WebRequestContextFilter> webRequestContextFilter() {
        FilterRegistrationBean<WebRequestContextFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new WebRequestContextFilter());
        registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return registrationBean;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
