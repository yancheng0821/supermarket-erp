import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'
import { SystemRolesPage } from './index'

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

describe('system roles page i18n', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh')
    apiGetMock.mockReset()
    apiPostMock.mockReset()
    apiPutMock.mockReset()
    apiGetMock.mockResolvedValue({
      list: [
        {
          id: 1,
          name: '管理员',
          code: 'admin',
          sort: 10,
          status: 0,
          remark: '默认角色',
        },
      ],
      total: 1,
    })
  })

  it('renders localized system roles page and dialog copy', async () => {
    render(<SystemRolesPage />)

    expect(screen.getByText('系统角色')).toBeInTheDocument()
    expect(
      screen.getByText('管理租户内的角色身份和启停状态。')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '新增角色' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('按角色名称搜索')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('按角色编码搜索')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '搜索' })).toBeInTheDocument()
    expect(screen.getByText('名称')).toBeInTheDocument()
    expect(screen.getByText('编码')).toBeInTheDocument()
    expect(screen.getByText('排序')).toBeInTheDocument()
    expect(screen.getAllByText('状态').length).toBeGreaterThan(0)
    expect(screen.getByText('备注')).toBeInTheDocument()
    expect(screen.getByText('操作')).toBeInTheDocument()
    expect(await screen.findByText('管理员')).toBeInTheDocument()
    expect(screen.getByText('禁用')).toBeInTheDocument()
    expect(screen.getByText('共 1 条 | 第 1 / 1 页')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '新增角色' }))

    expect(screen.getByText('创建角色')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('角色名称')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('角色编码')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('排序')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('备注')).toBeInTheDocument()
  })

  it('stores system role locale keys and removes legacy english strings', () => {
    expect(en).toMatchObject({
      systemRoles: expect.objectContaining({
        title: 'System Roles',
        newRole: 'New Role',
      }),
    })

    expect(zh).toMatchObject({
      systemRoles: expect.objectContaining({
        title: '系统角色',
        newRole: '新增角色',
      }),
    })

    const source = readFileSync(
      path.join(path.resolve(import.meta.dirname), 'index.tsx'),
      'utf8'
    )

    expect(source).not.toContain('System Roles')
    expect(source).not.toContain(
      'Manage role identities and activation state inside the tenant.'
    )
    expect(source).not.toContain('New Role')
    expect(source).not.toContain('Search by role name')
    expect(source).not.toContain('Search by role code')
    expect(source).not.toContain('Loading roles...')
    expect(source).not.toContain('No roles found.')
    expect(source).not.toContain('Role updated')
    expect(source).not.toContain('Role created')
    expect(source).not.toContain('Failed to load roles')
    expect(source).not.toContain('Failed to save role')
    expect(source).not.toContain('Role status updated')
    expect(source).not.toContain('Failed to update role')
    expect(source).not.toContain('Edit Role')
    expect(source).not.toContain('Create Role')
    expect(source).not.toContain('Role Name')
    expect(source).not.toContain('Role Code')
  })
})
