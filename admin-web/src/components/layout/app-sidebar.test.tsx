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
          children: [],
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

    expect(titles).toContain('Tenant Management')
    expect(titles).not.toContain('sidebar.businessModules')
    expect(sidebar.teams[0]?.name).toBe('平台控制台')
    expect(sidebar.teams[0]?.plan).toBe('平台管理员')
  })

  it('keeps ERP fallback groups for tenant sessions', () => {
    const sidebar = buildSidebarData(tenantSession)
    const titles = flattenTitles(sidebar.navGroups)

    expect(titles).toContain('User Management')
    expect(titles).toContain('sidebar.businessModules')
  })
})
