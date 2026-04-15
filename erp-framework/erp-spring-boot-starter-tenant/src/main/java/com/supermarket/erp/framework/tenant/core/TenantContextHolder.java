package com.supermarket.erp.framework.tenant.core;

import com.alibaba.ttl.TransmittableThreadLocal;

/**
 * Tenant context holder using TransmittableThreadLocal for cross-thread propagation.
 */
public class TenantContextHolder {

    private static final TransmittableThreadLocal<Long> TENANT_ID = new TransmittableThreadLocal<>();

    private static final TransmittableThreadLocal<Boolean> IGNORE = new TransmittableThreadLocal<>();

    public static Long getTenantId() {
        return TENANT_ID.get();
    }

    public static Long getRequiredTenantId() {
        Long tenantId = getTenantId();
        if (tenantId == null) {
            throw new IllegalStateException("TenantContextHolder tenant id is required but not set");
        }
        return tenantId;
    }

    public static void setTenantId(Long tenantId) {
        TENANT_ID.set(tenantId);
    }

    public static void setIgnore(boolean ignore) {
        IGNORE.set(ignore);
    }

    public static boolean isIgnore() {
        return Boolean.TRUE.equals(IGNORE.get());
    }

    public static void clear() {
        TENANT_ID.remove();
        IGNORE.remove();
    }
}
