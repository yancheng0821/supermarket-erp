package com.supermarket.erp.framework.security.core;

public enum LoginScope {

    PLATFORM("platform", 0),
    TENANT("tenant", 1);

    private final String code;
    private final int userType;

    LoginScope(String code, int userType) {
        this.code = code;
        this.userType = userType;
    }

    public String getCode() {
        return code;
    }

    public int getUserType() {
        return userType;
    }

    public static LoginScope of(String code) {
        for (LoginScope scope : values()) {
            if (scope.code.equalsIgnoreCase(code)) {
                return scope;
            }
        }
        throw new IllegalArgumentException("Unknown login scope: " + code);
    }
}
