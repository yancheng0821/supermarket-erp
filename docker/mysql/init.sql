CREATE DATABASE IF NOT EXISTS supermarket_erp DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE supermarket_erp;

-- Tenant (no tenant_id, this is the root table)
CREATE TABLE sys_tenant (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'Tenant name',
    contact_name VARCHAR(50) COMMENT 'Contact person',
    contact_phone VARCHAR(20) COMMENT 'Contact phone',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=enabled, 1=disabled',
    expire_date DATETIME COMMENT 'Expiry date',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_name (name)
) COMMENT 'Tenant table';

-- Admin User
CREATE TABLE sys_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    username VARCHAR(50) NOT NULL COMMENT 'Username',
    password VARCHAR(200) NOT NULL COMMENT 'Password (BCrypt)',
    nickname VARCHAR(50) COMMENT 'Display name',
    phone VARCHAR(20) COMMENT 'Phone',
    email VARCHAR(100) COMMENT 'Email',
    avatar VARCHAR(500) COMMENT 'Avatar URL',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=enabled, 1=disabled',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    UNIQUE INDEX uk_username (username, deleted, tenant_id),
    INDEX idx_tenant (tenant_id)
) COMMENT 'Admin user table';

-- Role
CREATE TABLE sys_role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL COMMENT 'Role name',
    code VARCHAR(50) NOT NULL COMMENT 'Role code',
    sort INT NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 0,
    remark VARCHAR(500) COMMENT 'Remark',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id)
) COMMENT 'Role table';

-- Menu (no tenant_id, global)
CREATE TABLE sys_menu (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT 'Menu name',
    permission VARCHAR(100) COMMENT 'Permission key',
    type TINYINT NOT NULL COMMENT '1=dir, 2=menu, 3=button',
    parent_id BIGINT NOT NULL DEFAULT 0 COMMENT 'Parent ID',
    path VARCHAR(200) COMMENT 'Route path',
    component VARCHAR(200) COMMENT 'Component path',
    icon VARCHAR(100) COMMENT 'Icon',
    sort INT NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 0,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0
) COMMENT 'Menu/permission table';

-- Role-Menu mapping
CREATE TABLE sys_role_menu (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_role (role_id),
    INDEX idx_tenant (tenant_id)
) COMMENT 'Role-Menu mapping';

-- User-Role mapping
CREATE TABLE sys_user_role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_user (user_id),
    INDEX idx_tenant (tenant_id)
) COMMENT 'User-Role mapping';

-- Seed data
INSERT INTO sys_tenant (id, name, contact_name, contact_phone, status) VALUES (1, 'Default Tenant', 'Admin', '13800000000', 0);
INSERT INTO sys_user (id, tenant_id, username, password, nickname, status) VALUES (1, 1, 'admin', '$2a$10$EqKcp1WFKVQISheBxnFOheP8vYCmRt.tI8YbL.FwNKVrz6AuO8BKu', 'Super Admin', 0);
INSERT INTO sys_role (id, tenant_id, name, code, sort, status) VALUES (1, 1, 'Super Admin', 'super_admin', 0, 0);
INSERT INTO sys_user_role (user_id, role_id, tenant_id) VALUES (1, 1, 1);
