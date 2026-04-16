USE supermarket_erp;

SET @schema_name = DATABASE();

SET @tenant_code_column_sql = IF(
    EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = @schema_name
          AND table_name = 'sys_tenant'
          AND column_name = 'code'
    ),
    'SELECT 1',
    'ALTER TABLE sys_tenant ADD COLUMN code VARCHAR(64) NULL COMMENT ''Tenant login code'' AFTER id'
);
PREPARE stmt FROM @tenant_code_column_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE sys_tenant
SET code = CASE
    WHEN id = 1 THEN 'freshmart-sh'
    ELSE CONCAT('tenant-', id)
END
WHERE code IS NULL OR code = '';

SET @tenant_code_index_sql = IF(
    EXISTS (
        SELECT 1
        FROM information_schema.statistics
        WHERE table_schema = @schema_name
          AND table_name = 'sys_tenant'
          AND index_name = 'uk_code'
    ),
    'SELECT 1',
    'ALTER TABLE sys_tenant ADD UNIQUE INDEX uk_code (code)'
);
PREPARE stmt FROM @tenant_code_index_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

ALTER TABLE sys_tenant
    MODIFY COLUMN code VARCHAR(64) NOT NULL COMMENT 'Tenant login code';

CREATE TABLE IF NOT EXISTS sys_platform_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL COMMENT 'Platform username',
    password VARCHAR(200) NOT NULL COMMENT 'Password (BCrypt)',
    nickname VARCHAR(50) COMMENT 'Display name',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '0=enabled, 1=disabled',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    creator VARCHAR(64) DEFAULT '',
    updater VARCHAR(64) DEFAULT '',
    deleted BIT(1) NOT NULL DEFAULT 0,
    UNIQUE INDEX uk_username (username, deleted)
) COMMENT 'Platform admin user table';

SET @menu_scope_column_sql = IF(
    EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = @schema_name
          AND table_name = 'sys_menu'
          AND column_name = 'scope'
    ),
    'SELECT 1',
    'ALTER TABLE sys_menu ADD COLUMN scope VARCHAR(16) NOT NULL DEFAULT ''tenant'' COMMENT ''platform|tenant|both'' AFTER id'
);
PREPARE stmt FROM @menu_scope_column_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE sys_menu
SET scope = 'tenant'
WHERE scope IS NULL OR scope = '';

INSERT INTO sys_platform_user (id, username, password, nickname, status)
SELECT 1,
       'platform-admin',
       '$2b$12$4kJjReLEFNQ0aUVUg65SvuO6OjKY5ybCjp.HtdPfZH1vp0868R6a.',
       'Platform Admin',
       0
WHERE NOT EXISTS (
    SELECT 1
    FROM sys_platform_user
    WHERE username = 'platform-admin'
      AND deleted = 0
);

UPDATE sys_platform_user
SET password = '$2b$12$4kJjReLEFNQ0aUVUg65SvuO6OjKY5ybCjp.HtdPfZH1vp0868R6a.'
WHERE username = 'platform-admin'
  AND deleted = 0;

UPDATE sys_user
SET password = '$2b$12$4kJjReLEFNQ0aUVUg65SvuO6OjKY5ybCjp.HtdPfZH1vp0868R6a.'
WHERE tenant_id = 1
  AND username = 'admin'
  AND deleted = 0;

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 1, 'platform', 'Platform Management', NULL, 1, 0, '/platform', NULL, 'shield', 1, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 1);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 2, 'platform', 'Tenant Management', 'platform:tenant:page', 2, 1, '/platform/tenants', 'platform/tenants/index', 'building', 10, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 2);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 3, 'platform', 'Create Tenant', 'platform:tenant:create', 3, 2, NULL, NULL, NULL, 11, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 3);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 4, 'platform', 'Update Tenant', 'platform:tenant:update', 3, 2, NULL, NULL, NULL, 12, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 4);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 5, 'platform', 'Update Tenant Status', 'platform:tenant:update-status', 3, 2, NULL, NULL, NULL, 13, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 5);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 6, 'platform', 'Menu Management', 'platform:menu:tree', 2, 1, '/platform/menus', 'platform/menus/index', 'menu', 20, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 6);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 7, 'platform', 'Create Menu', 'platform:menu:create', 3, 6, NULL, NULL, NULL, 21, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 7);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 8, 'platform', 'Update Menu', 'platform:menu:update', 3, 6, NULL, NULL, NULL, 22, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 8);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 101, 'tenant', 'System Management', NULL, 1, 0, '/system', NULL, 'settings', 1, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 101);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 102, 'tenant', 'User Management', 'system:user:page', 2, 101, '/system/users', 'system/users/index', 'users', 10, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 102);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 103, 'tenant', 'Create User', 'system:user:create', 3, 102, NULL, NULL, NULL, 11, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 103);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 104, 'tenant', 'Update User', 'system:user:update', 3, 102, NULL, NULL, NULL, 12, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 104);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 105, 'tenant', 'Update User Status', 'system:user:update-status', 3, 102, NULL, NULL, NULL, 13, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 105);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 106, 'tenant', 'Reset User Password', 'system:user:reset-password', 3, 102, NULL, NULL, NULL, 14, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 106);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 107, 'tenant', 'Assign User Roles', 'system:user:assign-role', 3, 102, NULL, NULL, NULL, 15, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 107);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 108, 'tenant', 'Role Management', 'system:role:page', 2, 101, '/system/roles', 'system/roles/index', 'shield-check', 20, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 108);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 109, 'tenant', 'Create Role', 'system:role:create', 3, 108, NULL, NULL, NULL, 21, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 109);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 110, 'tenant', 'Update Role', 'system:role:update', 3, 108, NULL, NULL, NULL, 22, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 110);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 111, 'tenant', 'Update Role Status', 'system:role:update-status', 3, 108, NULL, NULL, NULL, 23, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 111);

INSERT INTO sys_menu (id, scope, name, permission, type, parent_id, path, component, icon, sort, status)
SELECT 112, 'tenant', 'Assign Role Menus', 'system:role:assign-menu', 3, 108, NULL, NULL, NULL, 24, 0
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE id = 112);

INSERT INTO sys_role_menu (role_id, menu_id, tenant_id, creator)
SELECT 1, 101, 1, 'system'
WHERE EXISTS (SELECT 1 FROM sys_role WHERE id = 1 AND tenant_id = 1)
  AND NOT EXISTS (SELECT 1 FROM sys_role_menu WHERE role_id = 1 AND menu_id = 101 AND tenant_id = 1 AND deleted = 0);

INSERT INTO sys_role_menu (role_id, menu_id, tenant_id, creator)
SELECT 1, 102, 1, 'system'
WHERE EXISTS (SELECT 1 FROM sys_role WHERE id = 1 AND tenant_id = 1)
  AND NOT EXISTS (SELECT 1 FROM sys_role_menu WHERE role_id = 1 AND menu_id = 102 AND tenant_id = 1 AND deleted = 0);

INSERT INTO sys_role_menu (role_id, menu_id, tenant_id, creator)
SELECT 1, 103, 1, 'system'
WHERE EXISTS (SELECT 1 FROM sys_role WHERE id = 1 AND tenant_id = 1)
  AND NOT EXISTS (SELECT 1 FROM sys_role_menu WHERE role_id = 1 AND menu_id = 103 AND tenant_id = 1 AND deleted = 0);

INSERT INTO sys_role_menu (role_id, menu_id, tenant_id, creator)
SELECT 1, 104, 1, 'system'
WHERE EXISTS (SELECT 1 FROM sys_role WHERE id = 1 AND tenant_id = 1)
  AND NOT EXISTS (SELECT 1 FROM sys_role_menu WHERE role_id = 1 AND menu_id = 104 AND tenant_id = 1 AND deleted = 0);

INSERT INTO sys_role_menu (role_id, menu_id, tenant_id, creator)
SELECT 1, 105, 1, 'system'
WHERE EXISTS (SELECT 1 FROM sys_role WHERE id = 1 AND tenant_id = 1)
  AND NOT EXISTS (SELECT 1 FROM sys_role_menu WHERE role_id = 1 AND menu_id = 105 AND tenant_id = 1 AND deleted = 0);

INSERT INTO sys_role_menu (role_id, menu_id, tenant_id, creator)
SELECT 1, 106, 1, 'system'
WHERE EXISTS (SELECT 1 FROM sys_role WHERE id = 1 AND tenant_id = 1)
  AND NOT EXISTS (SELECT 1 FROM sys_role_menu WHERE role_id = 1 AND menu_id = 106 AND tenant_id = 1 AND deleted = 0);

INSERT INTO sys_role_menu (role_id, menu_id, tenant_id, creator)
SELECT 1, 107, 1, 'system'
WHERE EXISTS (SELECT 1 FROM sys_role WHERE id = 1 AND tenant_id = 1)
  AND NOT EXISTS (SELECT 1 FROM sys_role_menu WHERE role_id = 1 AND menu_id = 107 AND tenant_id = 1 AND deleted = 0);

INSERT INTO sys_role_menu (role_id, menu_id, tenant_id, creator)
SELECT 1, 108, 1, 'system'
WHERE EXISTS (SELECT 1 FROM sys_role WHERE id = 1 AND tenant_id = 1)
  AND NOT EXISTS (SELECT 1 FROM sys_role_menu WHERE role_id = 1 AND menu_id = 108 AND tenant_id = 1 AND deleted = 0);

INSERT INTO sys_role_menu (role_id, menu_id, tenant_id, creator)
SELECT 1, 109, 1, 'system'
WHERE EXISTS (SELECT 1 FROM sys_role WHERE id = 1 AND tenant_id = 1)
  AND NOT EXISTS (SELECT 1 FROM sys_role_menu WHERE role_id = 1 AND menu_id = 109 AND tenant_id = 1 AND deleted = 0);

INSERT INTO sys_role_menu (role_id, menu_id, tenant_id, creator)
SELECT 1, 110, 1, 'system'
WHERE EXISTS (SELECT 1 FROM sys_role WHERE id = 1 AND tenant_id = 1)
  AND NOT EXISTS (SELECT 1 FROM sys_role_menu WHERE role_id = 1 AND menu_id = 110 AND tenant_id = 1 AND deleted = 0);

INSERT INTO sys_role_menu (role_id, menu_id, tenant_id, creator)
SELECT 1, 111, 1, 'system'
WHERE EXISTS (SELECT 1 FROM sys_role WHERE id = 1 AND tenant_id = 1)
  AND NOT EXISTS (SELECT 1 FROM sys_role_menu WHERE role_id = 1 AND menu_id = 111 AND tenant_id = 1 AND deleted = 0);

INSERT INTO sys_role_menu (role_id, menu_id, tenant_id, creator)
SELECT 1, 112, 1, 'system'
WHERE EXISTS (SELECT 1 FROM sys_role WHERE id = 1 AND tenant_id = 1)
  AND NOT EXISTS (SELECT 1 FROM sys_role_menu WHERE role_id = 1 AND menu_id = 112 AND tenant_id = 1 AND deleted = 0);
