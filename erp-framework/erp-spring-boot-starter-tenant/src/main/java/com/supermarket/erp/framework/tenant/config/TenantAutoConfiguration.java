package com.supermarket.erp.framework.tenant.config;

import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.TenantLineInnerInterceptor;
import com.supermarket.erp.framework.tenant.core.TenantDatabaseInterceptor;
import com.supermarket.erp.framework.tenant.web.TenantContextWebFilter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(prefix = "erp.tenant", name = "enable", havingValue = "true", matchIfMissing = true)
@EnableConfigurationProperties(TenantProperties.class)
public class TenantAutoConfiguration {

    @Bean
    public TenantLineInnerInterceptor tenantLineInnerInterceptor(TenantProperties tenantProperties,
                                                                  MybatisPlusInterceptor mybatisPlusInterceptor) {
        TenantDatabaseInterceptor handler = new TenantDatabaseInterceptor(tenantProperties);
        TenantLineInnerInterceptor interceptor = new TenantLineInnerInterceptor(handler);
        // getInterceptors() may return unmodifiable list, use addInnerInterceptor instead
        mybatisPlusInterceptor.addInnerInterceptor(interceptor);
        return interceptor;
    }

    @Bean
    public FilterRegistrationBean<TenantContextWebFilter> tenantContextWebFilter() {
        FilterRegistrationBean<TenantContextWebFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new TenantContextWebFilter());
        registrationBean.setOrder(-100);
        return registrationBean;
    }
}
