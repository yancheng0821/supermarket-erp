import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'
import { PlatformMenusPage } from './index'

const { apiGetMock, apiPostMock, apiPutMock } = vi.hoisted(() => ({
  apiGetMock: vi.fn(),
  apiPostMock: vi.fn(),
  apiPutMock: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  api: {
    get: apiGetMock,
    post: apiPostMock,
    put: apiPutMock,
  },
}))

vi.mock('@/features/auth/permissions', () => ({
  hasPermission: () => true,
}))

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: (
    selector: (state: { permissions: string[] }) => unknown
  ) => selector({ permissions: [] }),
}))

vi.mock('@/components/layout/header', () => ({
  Header: ({ children }: { children: React.ReactNode }) => <header>{children}</header>,
}))

vi.mock('@/components/layout/main', () => ({
  Main: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => <main className={className}>{children}</main>,
}))

vi.mock('@/components/language-switch', () => ({
  LanguageSwitch: () => <div data-testid='language-switch' />,
}))

vi.mock('@/components/theme-switch', () => ({
  ThemeSwitch: () => <div data-testid='theme-switch' />,
}))

vi.mock('@/components/profile-dropdown', () => ({
  ProfileDropdown: () => <div data-testid='profile-dropdown' />,
}))

describe('platform menus i18n', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh')
    apiGetMock.mockReset()
    apiPostMock.mockReset()
    apiPutMock.mockReset()
    apiGetMock.mockResolvedValue([
      {
        id: 1,
        scope: 'platform',
        name: 'Platform',
        permission: 'platform:view',
        type: 1,
        parentId: 0,
        path: '/platform',
        component: null,
        icon: 'settings',
        sort: 10,
        status: 0,
        children: [],
      },
    ])
  })

  it('renders localized platform menus page and dialog copy', async () => {
    render(<PlatformMenusPage />)

    expect(screen.getByText('平台菜单')).toBeInTheDocument()
    expect(
      screen.getByText('管理平台导航树和权限绑定。')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '新增菜单' })
    ).toBeInTheDocument()
    expect(screen.getByText('名称')).toBeInTheDocument()
    expect(screen.getByText('权限标识')).toBeInTheDocument()
    expect(screen.getByText('类型')).toBeInTheDocument()
    expect(screen.getByText('路径')).toBeInTheDocument()
    expect(screen.getAllByText('状态').length).toBeGreaterThan(0)
    expect(screen.getByText('操作')).toBeInTheDocument()
    expect(await screen.findByText('目录')).toBeInTheDocument()
    expect(screen.getByText('启用')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '新增菜单' }))

    expect(screen.getByText('创建菜单')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('菜单名称')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('权限标识')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('路由路径')).toBeInTheDocument()
  })

  it('stores platform menu locale keys and removes legacy english strings', () => {
    expect(en).toMatchObject({
      platformMenus: expect.objectContaining({
        title: 'Platform Menus',
        newMenu: 'New Menu',
      }),
    })

    expect(zh).toMatchObject({
      platformMenus: expect.objectContaining({
        title: '平台菜单',
        newMenu: '新增菜单',
      }),
    })

    const source = readFileSync(
      path.join(path.resolve(import.meta.dirname), 'index.tsx'),
      'utf8'
    )

    expect(source).not.toContain('Platform Menus')
    expect(source).not.toContain(
      'Manage the platform navigation tree and permission bindings.'
    )
    expect(source).not.toContain('New Menu')
    expect(source).not.toContain('Loading menus...')
    expect(source).not.toContain('No menus found.')
    expect(source).not.toContain('Edit Menu')
    expect(source).not.toContain('Create Menu')
    expect(source).not.toContain('Menu Name')
    expect(source).not.toContain('Menu updated')
    expect(source).not.toContain('Menu created')
    expect(source).not.toContain('Failed to load menus')
    expect(source).not.toContain('Failed to save menu')
  })
})
