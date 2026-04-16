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

function mapMenuItem(menu: AuthMenuItem): NavItem {
  if (menu.children.length > 0) {
    return {
      title: menu.name,
      icon: resolveIcon(menu.icon),
      items: menu.children.map(mapMenuItem),
    }
  }

  return {
    title: menu.name,
    url: normalizePath(menu.path),
    icon: resolveIcon(menu.icon),
  }
}

type SessionLike = AuthSessionResponse | AuthSessionSnapshot

export function buildSidebarData(session: SessionLike): SidebarData {
  const dynamicGroups = session.menuTree.map((menu) => ({
    title: menu.name,
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
