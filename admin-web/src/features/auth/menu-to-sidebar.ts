import { Building2, Settings, Store, UserCheck, type LucideIcon } from 'lucide-react'
import {
  sidebarTeams,
  sidebarUser,
  tenantFallbackNavGroups,
} from '@/components/layout/data/sidebar-data'
import i18n from '@/i18n'
import type { NavItem, SidebarData } from '@/components/layout/types'
import type { AuthMenuItem, AuthSessionResponse, AuthSessionSnapshot } from './types'

const iconMap: Record<string, LucideIcon> = {
  building: Building2,
  settings: Settings,
  users: UserCheck,
}

const menuTranslationKeysByPath: Record<string, string> = {
  '/platform': 'authMenu.platformManagement',
  '/platform/tenants': 'authMenu.tenantManagement',
  '/platform/menus': 'authMenu.menuManagement',
  '/system': 'authMenu.systemManagement',
  '/system/users': 'authMenu.userManagement',
  '/system/roles': 'authMenu.roleManagement',
}

const menuTranslationKeysByPermission: Record<string, string> = {
  'platform:tenant:page': 'authMenu.tenantManagement',
  'platform:tenant:create': 'authMenu.createTenant',
  'platform:tenant:update': 'authMenu.updateTenant',
  'platform:tenant:update-status': 'authMenu.updateTenantStatus',
  'platform:menu:tree': 'authMenu.menuManagement',
  'platform:menu:create': 'authMenu.createMenu',
  'platform:menu:update': 'authMenu.updateMenu',
  'system:user:page': 'authMenu.userManagement',
  'system:user:create': 'authMenu.createUser',
  'system:user:update': 'authMenu.updateUser',
  'system:user:update-status': 'authMenu.updateUserStatus',
  'system:user:reset-password': 'authMenu.resetUserPassword',
  'system:user:assign-role': 'authMenu.assignUserRoles',
  'system:role:page': 'authMenu.roleManagement',
  'system:role:create': 'authMenu.createRole',
  'system:role:update': 'authMenu.updateRole',
  'system:role:update-status': 'authMenu.updateRoleStatus',
  'system:role:assign-menu': 'authMenu.assignRoleMenus',
}

function resolveIcon(icon?: string | null) {
  if (!icon) {
    return Settings
  }
  return iconMap[icon] ?? Settings
}

function normalizePath(path?: string | null) {
  if (!path) {
    return '/'
  }
  return path.startsWith('/') ? path : `/${path}`
}

function resolveMenuTitle(menu: AuthMenuItem) {
  const translationKey =
    (menu.permission && menuTranslationKeysByPermission[menu.permission]) ||
    menuTranslationKeysByPath[normalizePath(menu.path)]

  if (!translationKey) {
    return menu.name
  }

  return i18n.t(translationKey, { defaultValue: menu.name })
}

function mapMenuItem(menu: AuthMenuItem): NavItem {
  if (menu.children.length > 0) {
    return {
      title: resolveMenuTitle(menu),
      icon: resolveIcon(menu.icon),
      matchUrl: normalizePath(menu.path),
      items: menu.children.map(mapMenuItem),
    }
  }

  return {
    title: resolveMenuTitle(menu),
    url: normalizePath(menu.path),
    icon: resolveIcon(menu.icon),
  }
}

type SessionLike = AuthSessionResponse | AuthSessionSnapshot

export function buildSidebarData(session: SessionLike): SidebarData {
  const dynamicGroups = session.menuTree.map((menu) => ({
    title: resolveMenuTitle(menu),
    items: (menu.children.length > 0 ? menu.children : [menu]).map(mapMenuItem),
  }))

  return {
    user: {
      ...sidebarUser,
      name: session.user.nickname,
      email: session.user.username,
    },
    teams: [
      {
        ...sidebarTeams[0],
        name:
          session.loginScope === 'platform'
            ? i18n.t('auth.platformConsole')
            : session.tenant?.tenantName || sidebarTeams[0].name,
        logo: Store,
        plan:
          session.loginScope === 'platform'
            ? i18n.t('auth.platformAdmin')
            : session.tenant?.tenantCode || sidebarTeams[0].plan,
      },
    ],
    navGroups:
      session.loginScope === 'tenant'
        ? [...dynamicGroups, ...tenantFallbackNavGroups]
        : dynamicGroups,
  }
}
