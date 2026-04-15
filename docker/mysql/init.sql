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

-- ============================================================
-- Archive Module Tables
-- ============================================================

-- Store
CREATE TABLE IF NOT EXISTS arc_store (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    name VARCHAR(100) NOT NULL COMMENT 'Store name',
    code VARCHAR(50) COMMENT 'Store code',
    type TINYINT DEFAULT 0 COMMENT 'Store type',
    address VARCHAR(500) COMMENT 'Address',
    contact_name VARCHAR(50) COMMENT 'Contact person',
    contact_phone VARCHAR(20) COMMENT 'Contact phone',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=enabled, 1=disabled',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id)
) COMMENT 'Store table';

-- Warehouse
CREATE TABLE IF NOT EXISTS arc_warehouse (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    name VARCHAR(100) NOT NULL COMMENT 'Warehouse name',
    code VARCHAR(50) COMMENT 'Warehouse code',
    type TINYINT DEFAULT 0 COMMENT 'Warehouse type',
    address VARCHAR(500) COMMENT 'Address',
    contact_name VARCHAR(50) COMMENT 'Contact person',
    contact_phone VARCHAR(20) COMMENT 'Contact phone',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=enabled, 1=disabled',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id)
) COMMENT 'Warehouse table';

-- Supplier
CREATE TABLE IF NOT EXISTS arc_supplier (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    name VARCHAR(100) NOT NULL COMMENT 'Supplier name',
    code VARCHAR(50) COMMENT 'Supplier code',
    contact_name VARCHAR(50) COMMENT 'Contact person',
    contact_phone VARCHAR(20) COMMENT 'Contact phone',
    email VARCHAR(100) COMMENT 'Email',
    address VARCHAR(500) COMMENT 'Address',
    settlement_type TINYINT DEFAULT 0 COMMENT 'Settlement type',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=enabled, 1=disabled',
    remark VARCHAR(500) COMMENT 'Remark',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    INDEX idx_name (name)
) COMMENT 'Supplier table';

-- Category
CREATE TABLE IF NOT EXISTS arc_category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    name VARCHAR(100) NOT NULL COMMENT 'Category name',
    parent_id BIGINT DEFAULT 0 COMMENT 'Parent category ID',
    level TINYINT DEFAULT 1 COMMENT 'Category level',
    sort INT DEFAULT 0 COMMENT 'Sort order',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=enabled, 1=disabled',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    INDEX idx_parent (parent_id)
) COMMENT 'Product category table';

-- Product
CREATE TABLE IF NOT EXISTS arc_product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    name VARCHAR(200) NOT NULL COMMENT 'Product name',
    barcode VARCHAR(50) COMMENT 'Barcode',
    category_id BIGINT COMMENT 'Category ID',
    supplier_id BIGINT COMMENT 'Supplier ID',
    spec VARCHAR(100) COMMENT 'Specification',
    unit VARCHAR(20) COMMENT 'Unit',
    shelf_life INT COMMENT 'Shelf life (days)',
    image_url VARCHAR(500) COMMENT 'Product image URL',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=enabled, 1=disabled',
    remark VARCHAR(500) COMMENT 'Remark',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    INDEX idx_barcode (barcode),
    INDEX idx_category (category_id),
    INDEX idx_name (name)
) COMMENT 'Product table';

-- Product Price
CREATE TABLE IF NOT EXISTS arc_product_price (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    product_id BIGINT NOT NULL COMMENT 'Product ID',
    store_id BIGINT COMMENT 'Store ID (NULL=default price)',
    cost_price DECIMAL(12,2) COMMENT 'Cost price',
    retail_price DECIMAL(12,2) COMMENT 'Retail price',
    vip_price DECIMAL(12,2) COMMENT 'VIP price',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    INDEX idx_product (product_id),
    INDEX idx_product_store (product_id, store_id)
) COMMENT 'Product price table';

-- Product-Store relation
CREATE TABLE IF NOT EXISTS arc_product_store (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    product_id BIGINT NOT NULL COMMENT 'Product ID',
    store_id BIGINT NOT NULL COMMENT 'Store ID',
    status TINYINT DEFAULT 0 COMMENT '0=enabled, 1=disabled',
    min_stock INT DEFAULT 0 COMMENT 'Minimum stock',
    max_stock INT DEFAULT 0 COMMENT 'Maximum stock',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    UNIQUE INDEX uk_product_store (product_id, store_id, tenant_id)
) COMMENT 'Product-Store mapping table';
