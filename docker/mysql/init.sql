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

-- ============================================================
-- Inventory Module Tables
-- ============================================================

-- Stock
CREATE TABLE IF NOT EXISTS inv_stock (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    product_id BIGINT NOT NULL COMMENT 'Product ID',
    location_type TINYINT NOT NULL COMMENT '1=store,2=warehouse',
    location_id BIGINT NOT NULL COMMENT 'Location ID',
    quantity DECIMAL(12,2) DEFAULT 0 COMMENT 'Current quantity',
    cost_amount DECIMAL(12,2) DEFAULT 0 COMMENT 'Total cost amount',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    UNIQUE INDEX uk_product_location (product_id, location_type, location_id, tenant_id),
    INDEX idx_tenant (tenant_id)
) COMMENT 'Inventory stock table';

-- Stock Log
CREATE TABLE IF NOT EXISTS inv_stock_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    product_id BIGINT NOT NULL COMMENT 'Product ID',
    location_type TINYINT NOT NULL COMMENT '1=store,2=warehouse',
    location_id BIGINT NOT NULL COMMENT 'Location ID',
    biz_type TINYINT NOT NULL COMMENT '1=receipt,2=issue,3=transfer_in,4=transfer_out,5=check_profit,6=check_loss',
    biz_id BIGINT COMMENT 'Business order ID',
    quantity_change DECIMAL(12,2) NOT NULL COMMENT 'Quantity change',
    quantity_before DECIMAL(12,2) NOT NULL COMMENT 'Quantity before',
    quantity_after DECIMAL(12,2) NOT NULL COMMENT 'Quantity after',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    INDEX idx_tenant (tenant_id),
    INDEX idx_product (product_id),
    INDEX idx_biz (biz_type, biz_id)
) COMMENT 'Inventory stock log table';

-- Receipt Order
CREATE TABLE IF NOT EXISTS inv_receipt_order (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    order_no VARCHAR(50) NOT NULL COMMENT 'Order number',
    type TINYINT NOT NULL COMMENT '1=purchase,2=transfer,3=return',
    location_type TINYINT NOT NULL COMMENT '1=store,2=warehouse',
    location_id BIGINT NOT NULL COMMENT 'Location ID',
    supplier_id BIGINT COMMENT 'Supplier ID',
    status TINYINT DEFAULT 0 COMMENT '0=draft,1=confirmed,2=cancelled',
    remark VARCHAR(500) COMMENT 'Remark',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    UNIQUE INDEX uk_order_no (order_no, tenant_id),
    INDEX idx_tenant (tenant_id)
) COMMENT 'Receipt order table';

-- Receipt Order Item
CREATE TABLE IF NOT EXISTS inv_receipt_order_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    order_id BIGINT NOT NULL COMMENT 'Receipt order ID',
    product_id BIGINT NOT NULL COMMENT 'Product ID',
    quantity DECIMAL(12,2) NOT NULL COMMENT 'Quantity',
    cost_price DECIMAL(12,2) COMMENT 'Cost price',
    remark VARCHAR(200) COMMENT 'Remark',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_order (order_id)
) COMMENT 'Receipt order item table';

-- Issue Order
CREATE TABLE IF NOT EXISTS inv_issue_order (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    order_no VARCHAR(50) NOT NULL COMMENT 'Order number',
    type TINYINT NOT NULL COMMENT '1=sales,2=transfer,3=damage',
    location_type TINYINT NOT NULL COMMENT '1=store,2=warehouse',
    location_id BIGINT NOT NULL COMMENT 'Location ID',
    supplier_id BIGINT COMMENT 'Supplier ID',
    status TINYINT DEFAULT 0 COMMENT '0=draft,1=confirmed,2=cancelled',
    remark VARCHAR(500) COMMENT 'Remark',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    UNIQUE INDEX uk_order_no (order_no, tenant_id),
    INDEX idx_tenant (tenant_id)
) COMMENT 'Issue order table';

-- Issue Order Item
CREATE TABLE IF NOT EXISTS inv_issue_order_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    order_id BIGINT NOT NULL COMMENT 'Issue order ID',
    product_id BIGINT NOT NULL COMMENT 'Product ID',
    quantity DECIMAL(12,2) NOT NULL COMMENT 'Quantity',
    cost_price DECIMAL(12,2) COMMENT 'Cost price',
    remark VARCHAR(200) COMMENT 'Remark',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_order (order_id)
) COMMENT 'Issue order item table';

-- Transfer Order
CREATE TABLE IF NOT EXISTS inv_transfer_order (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    order_no VARCHAR(50) NOT NULL COMMENT 'Order number',
    from_location_type TINYINT NOT NULL COMMENT '1=store,2=warehouse',
    from_location_id BIGINT NOT NULL COMMENT 'From location ID',
    to_location_type TINYINT NOT NULL COMMENT '1=store,2=warehouse',
    to_location_id BIGINT NOT NULL COMMENT 'To location ID',
    status TINYINT DEFAULT 0 COMMENT '0=draft,1=in_transit,2=received,3=cancelled',
    remark VARCHAR(500) COMMENT 'Remark',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    UNIQUE INDEX uk_order_no (order_no, tenant_id),
    INDEX idx_tenant (tenant_id)
) COMMENT 'Transfer order table';

-- Transfer Order Item
CREATE TABLE IF NOT EXISTS inv_transfer_order_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    order_id BIGINT NOT NULL COMMENT 'Transfer order ID',
    product_id BIGINT NOT NULL COMMENT 'Product ID',
    quantity DECIMAL(12,2) NOT NULL COMMENT 'Quantity',
    remark VARCHAR(200) COMMENT 'Remark',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_order (order_id)
) COMMENT 'Transfer order item table';

-- Check Order (Stocktaking)
CREATE TABLE IF NOT EXISTS inv_check_order (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    order_no VARCHAR(50) NOT NULL COMMENT 'Order number',
    location_type TINYINT NOT NULL COMMENT '1=store,2=warehouse',
    location_id BIGINT NOT NULL COMMENT 'Location ID',
    status TINYINT DEFAULT 0 COMMENT '0=draft,1=counting,2=confirmed,3=cancelled',
    remark VARCHAR(500) COMMENT 'Remark',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    UNIQUE INDEX uk_order_no (order_no, tenant_id),
    INDEX idx_tenant (tenant_id)
) COMMENT 'Check order table';

-- Check Order Item
CREATE TABLE IF NOT EXISTS inv_check_order_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL COMMENT 'Tenant ID',
    order_id BIGINT NOT NULL COMMENT 'Check order ID',
    product_id BIGINT NOT NULL COMMENT 'Product ID',
    system_quantity DECIMAL(12,2) NOT NULL COMMENT 'System quantity',
    actual_quantity DECIMAL(12,2) COMMENT 'Actual quantity',
    diff_quantity DECIMAL(12,2) COMMENT 'Difference quantity',
    remark VARCHAR(200) COMMENT 'Remark',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_order (order_id)
) COMMENT 'Check order item table';

-- ==================== Purchase Tables ====================

CREATE TABLE IF NOT EXISTS pur_purchase_order (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    order_no VARCHAR(50) NOT NULL,
    type TINYINT NOT NULL COMMENT '1=centralized, 2=direct, 3=self-purchase',
    supplier_id BIGINT,
    store_id BIGINT,
    warehouse_id BIGINT,
    total_amount DECIMAL(12,2) DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=draft,1=pending_review,2=approved,3=shipped,4=partially_received,5=completed,6=closed',
    remark VARCHAR(500),
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    UNIQUE INDEX uk_order_no (order_no, tenant_id)
) COMMENT 'Purchase order';

CREATE TABLE IF NOT EXISTS pur_purchase_order_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity DECIMAL(12,2) NOT NULL,
    received_quantity DECIMAL(12,2) NOT NULL DEFAULT 0,
    cost_price DECIMAL(12,2),
    amount DECIMAL(12,2),
    remark VARCHAR(200),
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_order (order_id)
) COMMENT 'Purchase order line items';

CREATE TABLE IF NOT EXISTS pur_replenish_plan (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    store_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    current_stock DECIMAL(12,2),
    min_stock DECIMAL(12,2),
    suggest_quantity DECIMAL(12,2),
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=pending, 1=approved, 2=converted',
    purchase_order_id BIGINT,
    remark VARCHAR(500),
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    INDEX idx_store (store_id)
) COMMENT 'Replenishment plan';

-- ==================== Operation Tables ====================

CREATE TABLE IF NOT EXISTS opr_sales_order (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    order_no VARCHAR(50) NOT NULL,
    channel TINYINT NOT NULL COMMENT '1=POS, 2=online, 3=O2O',
    store_id BIGINT NOT NULL,
    member_id BIGINT COMMENT 'Member ID if applicable',
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    pay_amount DECIMAL(12,2) NOT NULL DEFAULT 0 COMMENT 'Actual paid amount',
    item_count INT NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=pending_payment, 1=paid, 2=delivering, 3=completed, 4=cancelled, 5=refunded',
    remark VARCHAR(500),
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    UNIQUE INDEX uk_order_no (order_no, tenant_id),
    INDEX idx_store (store_id),
    INDEX idx_member (member_id),
    INDEX idx_create_time (create_time)
) COMMENT 'Sales order (unified POS/online)';

CREATE TABLE IF NOT EXISTS opr_sales_order_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200),
    quantity DECIMAL(12,2) NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    amount DECIMAL(12,2) NOT NULL COMMENT 'Line total after discount',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_order (order_id)
) COMMENT 'Sales order line items';

CREATE TABLE IF NOT EXISTS opr_payment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    payment_no VARCHAR(50) NOT NULL,
    method TINYINT NOT NULL COMMENT '1=cash, 2=wechat, 3=alipay, 4=member_card, 5=bank_card',
    amount DECIMAL(12,2) NOT NULL,
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=pending, 1=success, 2=failed, 3=refunded',
    third_party_no VARCHAR(100) COMMENT 'External transaction number',
    remark VARCHAR(200),
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    INDEX idx_order (order_id),
    UNIQUE INDEX uk_payment_no (payment_no, tenant_id)
) COMMENT 'Payment record';

CREATE TABLE IF NOT EXISTS opr_cashier_shift (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    store_id BIGINT NOT NULL,
    cashier_id BIGINT NOT NULL COMMENT 'User ID of cashier',
    cashier_name VARCHAR(50),
    shift_no VARCHAR(50),
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    opening_amount DECIMAL(12,2) NOT NULL DEFAULT 0 COMMENT 'Cash at shift start',
    closing_amount DECIMAL(12,2) COMMENT 'Cash at shift end',
    sales_amount DECIMAL(12,2) NOT NULL DEFAULT 0 COMMENT 'Total sales during shift',
    order_count INT NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=active, 1=closed',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    INDEX idx_store (store_id),
    INDEX idx_cashier (cashier_id)
) COMMENT 'Cashier shift';

CREATE TABLE IF NOT EXISTS opr_refund (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    refund_no VARCHAR(50) NOT NULL,
    order_id BIGINT NOT NULL COMMENT 'Original sales order',
    refund_amount DECIMAL(12,2) NOT NULL,
    reason VARCHAR(500),
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=pending, 1=approved, 2=completed, 3=rejected',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    INDEX idx_order (order_id),
    UNIQUE INDEX uk_refund_no (refund_no, tenant_id)
) COMMENT 'Refund/after-sales order';

-- ==================== Member Tables ====================

CREATE TABLE IF NOT EXISTS mbr_member (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    name VARCHAR(50),
    nickname VARCHAR(50),
    gender TINYINT COMMENT '0=unknown, 1=male, 2=female',
    birthday DATE,
    avatar VARCHAR(500),
    openid VARCHAR(100) COMMENT 'WeChat openid',
    level TINYINT NOT NULL DEFAULT 1 COMMENT 'Member level',
    status TINYINT NOT NULL DEFAULT 0,
    register_store_id BIGINT COMMENT 'Registration store',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    UNIQUE INDEX uk_phone (phone, tenant_id),
    INDEX idx_openid (openid)
) COMMENT 'Member table';

CREATE TABLE IF NOT EXISTS mbr_member_card (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    card_no VARCHAR(50) NOT NULL,
    level TINYINT NOT NULL DEFAULT 1 COMMENT '1=normal, 2=silver, 3=gold, 4=platinum',
    balance DECIMAL(12,2) NOT NULL DEFAULT 0,
    points INT NOT NULL DEFAULT 0,
    total_spend DECIMAL(12,2) NOT NULL DEFAULT 0 COMMENT 'Cumulative spending',
    status TINYINT NOT NULL DEFAULT 0,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    UNIQUE INDEX uk_card_no (card_no, tenant_id),
    INDEX idx_member (member_id)
) COMMENT 'Member card';

CREATE TABLE IF NOT EXISTS mbr_points_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    card_id BIGINT NOT NULL,
    type TINYINT NOT NULL COMMENT '1=earn, 2=redeem, 3=expire, 4=adjust',
    points INT NOT NULL COMMENT 'Change amount (+/-)',
    points_before INT NOT NULL,
    points_after INT NOT NULL,
    biz_type VARCHAR(50) COMMENT 'e.g. purchase, checkin, redeem',
    biz_id BIGINT,
    remark VARCHAR(200),
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tenant (tenant_id),
    INDEX idx_member (member_id)
) COMMENT 'Points movement journal';

CREATE TABLE IF NOT EXISTS mbr_balance_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    card_id BIGINT NOT NULL,
    type TINYINT NOT NULL COMMENT '1=topup, 2=spend, 3=refund, 4=adjust',
    amount DECIMAL(12,2) NOT NULL COMMENT 'Change amount (+/-)',
    balance_before DECIMAL(12,2) NOT NULL,
    balance_after DECIMAL(12,2) NOT NULL,
    biz_type VARCHAR(50),
    biz_id BIGINT,
    remark VARCHAR(200),
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tenant (tenant_id),
    INDEX idx_member (member_id)
) COMMENT 'Balance movement journal';

CREATE TABLE IF NOT EXISTS mbr_coupon (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    type TINYINT NOT NULL COMMENT '1=threshold_discount, 2=percentage_off, 3=category_coupon',
    discount_value DECIMAL(12,2) COMMENT 'Discount amount or percentage',
    min_spend DECIMAL(12,2) DEFAULT 0 COMMENT 'Minimum spend to use',
    category_id BIGINT COMMENT 'Applicable category (for type=3)',
    total_count INT NOT NULL DEFAULT 0 COMMENT 'Total issued',
    used_count INT NOT NULL DEFAULT 0,
    start_time DATETIME,
    end_time DATETIME,
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=active, 1=disabled',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id)
) COMMENT 'Coupon template';

CREATE TABLE IF NOT EXISTS mbr_coupon_instance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    coupon_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=unused, 1=used, 2=expired',
    use_time DATETIME,
    use_order_id BIGINT COMMENT 'Order that used this coupon',
    expire_time DATETIME,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    INDEX idx_member (member_id),
    INDEX idx_coupon (coupon_id)
) COMMENT 'Coupon instance (user-held)';

-- ==================== Online Tables ====================

CREATE TABLE IF NOT EXISTS onl_online_product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL COMMENT 'Reference to arc_product',
    store_id BIGINT NOT NULL,
    main_image VARCHAR(500),
    images VARCHAR(2000) COMMENT 'JSON array of image URLs',
    description TEXT,
    sort INT NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=listed, 1=delisted',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    INDEX idx_store (store_id),
    INDEX idx_product (product_id)
) COMMENT 'Online product (mini-program display)';

CREATE TABLE IF NOT EXISTS onl_shopping_cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    store_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity DECIMAL(12,2) NOT NULL DEFAULT 1,
    selected BIT(1) NOT NULL DEFAULT 1,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    INDEX idx_member (member_id)
) COMMENT 'Shopping cart';

CREATE TABLE IF NOT EXISTS onl_delivery_order (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    order_no VARCHAR(50) NOT NULL,
    sales_order_id BIGINT NOT NULL COMMENT 'Reference to opr_sales_order',
    store_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    delivery_type TINYINT NOT NULL COMMENT '1=delivery, 2=self_pickup',
    contact_name VARCHAR(50),
    contact_phone VARCHAR(20),
    address VARCHAR(500),
    expected_time DATETIME COMMENT 'Expected delivery/pickup time',
    actual_time DATETIME,
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=pending, 1=preparing, 2=delivering, 3=completed, 4=cancelled',
    remark VARCHAR(500),
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    INDEX idx_order (sales_order_id),
    UNIQUE INDEX uk_order_no (order_no, tenant_id)
) COMMENT 'Delivery order';

CREATE TABLE IF NOT EXISTS onl_store_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    store_id BIGINT NOT NULL,
    online_enabled BIT(1) NOT NULL DEFAULT 0,
    open_time VARCHAR(10) COMMENT 'e.g. 08:00',
    close_time VARCHAR(10) COMMENT 'e.g. 22:00',
    delivery_enabled BIT(1) NOT NULL DEFAULT 1,
    pickup_enabled BIT(1) NOT NULL DEFAULT 1,
    delivery_radius DECIMAL(5,1) COMMENT 'Delivery range in km',
    min_order_amount DECIMAL(12,2) DEFAULT 0,
    delivery_fee DECIMAL(12,2) DEFAULT 0,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    UNIQUE INDEX uk_store (store_id, tenant_id)
) COMMENT 'Store online configuration';

-- ==================== Finance Tables ====================

CREATE TABLE IF NOT EXISTS fin_supplier_settlement (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    settlement_no VARCHAR(50) NOT NULL,
    supplier_id BIGINT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=draft, 1=confirmed, 2=paid, 3=cancelled',
    remark VARCHAR(500),
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    UNIQUE INDEX uk_settlement_no (settlement_no, tenant_id),
    INDEX idx_supplier (supplier_id)
) COMMENT 'Supplier settlement';

CREATE TABLE IF NOT EXISTS fin_store_settlement (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    settlement_no VARCHAR(50) NOT NULL,
    store_id BIGINT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    sales_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    commission_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    net_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=draft, 1=confirmed, 2=paid, 3=cancelled',
    remark VARCHAR(500),
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    UNIQUE INDEX uk_settlement_no (settlement_no, tenant_id),
    INDEX idx_store (store_id)
) COMMENT 'Store (franchise) settlement';

CREATE TABLE IF NOT EXISTS fin_fee_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    fee_no VARCHAR(50) NOT NULL,
    type TINYINT NOT NULL COMMENT '1=manual, 2=promo_compensation, 3=rebate',
    target_type TINYINT NOT NULL COMMENT '1=supplier, 2=store',
    target_id BIGINT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=draft, 1=confirmed',
    remark VARCHAR(500),
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    UNIQUE INDEX uk_fee_no (fee_no, tenant_id)
) COMMENT 'Fee record';

CREATE TABLE IF NOT EXISTS fin_voucher (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    voucher_no VARCHAR(50) NOT NULL,
    biz_type VARCHAR(50) NOT NULL COMMENT 'e.g. purchase_receipt, sales, settlement',
    biz_id BIGINT,
    debit_account VARCHAR(100) NOT NULL,
    credit_account VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    period VARCHAR(10) COMMENT 'Accounting period e.g. 2026-04',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=draft, 1=posted',
    remark VARCHAR(500),
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    UNIQUE INDEX uk_voucher_no (voucher_no, tenant_id),
    INDEX idx_biz (biz_type, biz_id)
) COMMENT 'Financial voucher';

-- ==================== Analytics Tables ====================

CREATE TABLE IF NOT EXISTS rpt_daily_sales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    store_id BIGINT NOT NULL,
    report_date DATE NOT NULL,
    sales_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    cost_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    profit_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    order_count INT NOT NULL DEFAULT 0,
    customer_count INT NOT NULL DEFAULT 0,
    avg_order_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    UNIQUE INDEX uk_store_date (store_id, report_date, tenant_id)
) COMMENT 'Daily sales report (aggregated)';

CREATE TABLE IF NOT EXISTS rpt_product_sales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    store_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    report_date DATE NOT NULL,
    sales_quantity DECIMAL(12,2) NOT NULL DEFAULT 0,
    sales_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    cost_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    profit_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    UNIQUE INDEX uk_store_product_date (store_id, product_id, report_date, tenant_id)
) COMMENT 'Product sales report (aggregated)';

CREATE TABLE IF NOT EXISTS rpt_inventory_snapshot (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    location_type TINYINT NOT NULL,
    location_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    snapshot_date DATE NOT NULL,
    quantity DECIMAL(12,2) NOT NULL DEFAULT 0,
    cost_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted BIT(1) NOT NULL DEFAULT 0,
    INDEX idx_tenant (tenant_id),
    UNIQUE INDEX uk_location_product_date (location_type, location_id, product_id, snapshot_date, tenant_id)
) COMMENT 'Inventory snapshot (daily)';
