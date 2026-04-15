package com.supermarket.erp.framework.tenant.core;

import com.baomidou.mybatisplus.extension.plugins.handler.TenantLineHandler;
import com.supermarket.erp.framework.tenant.config.TenantProperties;
import net.sf.jsqlparser.expression.Expression;
import net.sf.jsqlparser.expression.LongValue;

/**
 * MyBatis-Plus tenant line handler that injects tenant_id conditions into SQL.
 */
public class TenantDatabaseInterceptor implements TenantLineHandler {

    private final TenantProperties properties;

    public TenantDatabaseInterceptor(TenantProperties properties) {
        this.properties = properties;
    }

    @Override
    public Expression getTenantId() {
        return new LongValue(TenantContextHolder.getRequiredTenantId());
    }

    @Override
    public String getTenantIdColumn() {
        return "tenant_id";
    }

    @Override
    public boolean ignoreTable(String tableName) {
        if (TenantContextHolder.isIgnore()) {
            return true;
        }
        return properties.getIgnoreTables().stream()
                .anyMatch(t -> t.equalsIgnoreCase(tableName));
    }
}
