import { beforeEach, describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import { buildSidebarData } from '@/features/auth/menu-to-sidebar'
import type { AuthSessionResponse } from '@/features/auth/types'

const platformSession: AuthSessionResponse = {
  loginScope: 'platform',
  user: {
    userId: 99,
    username: 'platform-admin',
    nickname: 'Platform Admin',
  },
  tenant: null,
  permissions: ['platform:tenant:page'],
  menuTree: [
    {
      id: 1,
      name: 'Platform',
      path: '/platform',
      component: 'layout/router-view',
      icon: 'building',
      permission: null,
      children: [
        {
          id: 2,
          name: 'Tenant Management',
          path: '/platform/tenants',
          component: 'platform/tenants/index',
          icon: 'building',
          permission: 'platform:tenant:page',
          children: [],
        },
      ],
    },
  ],
}

const tenantSession: AuthSessionResponse = {
  loginScope: 'tenant',
  user: {
    userId: 1,
    username: 'admin',
    nickname: 'Tenant Admin',
  },
  tenant: {
    tenantId: 1,
    tenantCode: 'freshmart-sh',
    tenantName: 'Freshmart Shanghai',
  },
  permissions: ['system:user:page'],
  menuTree: [
    {
      id: 101,
      name: 'System',
      path: '/system',
      component: 'layout/router-view',
      icon: 'settings',
      permission: null,
      children: [
        {
          id: 102,
          name: 'User Management',
          path: '/system/users',
          component: 'system/users/index',
          icon: 'users',
          permission: 'system:user:page',
          children: [
            {
              id: 103,
              name: 'Create User',
              path: '',
              component: null,
              icon: null,
              permission: 'system:user:create',
              children: [],
            },
            {
              id: 104,
              name: 'Update User',
              path: '',
              component: null,
              icon: null,
              permission: 'system:user:update',
              children: [],
            },
            {
              id: 105,
              name: 'Update User Status',
              path: '',
              component: null,
              icon: null,
              permission: 'system:user:update-status',
              children: [],
            },
            {
              id: 106,
              name: 'Reset User Password',
              path: '',
              component: null,
              icon: null,
              permission: 'system:user:reset-password',
              children: [],
            },
            {
              id: 107,
              name: 'Assign User Roles',
              path: '',
              component: null,
              icon: null,
              permission: 'system:user:assign-role',
              children: [],
            },
          ],
        },
        {
          id: 108,
          name: 'Role Management',
          path: '/system/roles',
          component: 'system/roles/index',
          icon: 'settings',
          permission: 'system:role:page',
          children: [
            {
              id: 109,
              name: 'Create Role',
              path: '',
              component: null,
              icon: null,
              permission: 'system:role:create',
              children: [],
            },
            {
              id: 110,
              name: 'Update Role',
              path: '',
              component: null,
              icon: null,
              permission: 'system:role:update',
              children: [],
            },
            {
              id: 111,
              name: 'Update Role Status',
              path: '',
              component: null,
              icon: null,
              permission: 'system:role:update-status',
              children: [],
            },
            {
              id: 112,
              name: 'Assign Role Menus',
              path: '',
              component: null,
              icon: null,
              permission: 'system:role:assign-menu',
              children: [],
            },
          ],
        },
      ],
    },
  ],
}

function flattenTitles(
  items: Array<{ title: string; items?: unknown[] }>
): string[] {
  return items.flatMap((item) =>
    'items' in item && Array.isArray(item.items)
      ? [
          item.title,
          ...flattenTitles(
            item.items as Array<{ title: string; items?: unknown[] }>
          ),
        ]
      : [item.title]
  )
}

describe('buildSidebarData', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh')
  })

  it('uses backend menus only for platform sessions', () => {
    const sidebar = buildSidebarData(platformSession)
    const titles = flattenTitles(sidebar.navGroups)

    expect(titles).toContain('平台管理')
    expect(titles).toContain('租户管理')
    expect(titles).not.toContain('sidebar.businessModules')
    expect(sidebar.teams[0]?.name).toBe('平台控制台')
    expect(sidebar.teams[0]?.plan).toBe('平台管理员')
  })

  it('keeps ERP fallback groups for tenant sessions', () => {
    const sidebar = buildSidebarData(tenantSession)
    const titles = flattenTitles(sidebar.navGroups)

    expect(titles).toContain('系统管理')
    expect(titles).toContain('用户管理')
    expect(titles).toContain('创建用户')
    expect(titles).toContain('编辑用户')
    expect(titles).toContain('更新用户状态')
    expect(titles).toContain('重置用户密码')
    expect(titles).toContain('分配用户角色')
    expect(titles).toContain('角色管理')
    expect(titles).toContain('创建角色')
    expect(titles).toContain('编辑角色')
    expect(titles).toContain('更新角色状态')
    expect(titles).toContain('分配角色菜单')
    expect(titles).toContain('sidebar.businessModules')
  })
})
