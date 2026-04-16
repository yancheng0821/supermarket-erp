import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'
import { SystemUsersPage } from './index'

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

describe('system users page i18n', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh')
    apiGetMock.mockReset()
    apiPostMock.mockReset()
    apiPutMock.mockReset()
    apiGetMock.mockResolvedValue({
      list: [
        {
          id: 1,
          username: 'tenant-admin',
          nickname: '张三',
          phone: '13800000000',
          email: 'zhangsan@example.com',
          avatar: null,
          status: 0,
        },
      ],
      total: 1,
    })
  })

  it('renders localized system users page and dialog copy', async () => {
    render(<SystemUsersPage />)

    expect(screen.getByText('系统用户')).toBeInTheDocument()
    expect(
      screen.getByText('管理租户管理员和系统访问账号。')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '新增用户' })
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('按用户名搜索')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('按昵称搜索')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '搜索' })).toBeInTheDocument()
    expect(screen.getByText('用户名')).toBeInTheDocument()
    expect(screen.getByText('昵称')).toBeInTheDocument()
    expect(screen.getByText('手机号')).toBeInTheDocument()
    expect(screen.getByText('邮箱')).toBeInTheDocument()
    expect(screen.getAllByText('状态').length).toBeGreaterThan(0)
    expect(screen.getByText('操作')).toBeInTheDocument()
    expect(await screen.findByText('tenant-admin')).toBeInTheDocument()
    expect(screen.getByText('禁用')).toBeInTheDocument()
    expect(screen.getByText('共 1 条 | 第 1 / 1 页')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '新增用户' }))

    expect(screen.getByText('创建用户')).toBeInTheDocument()
    expect(screen.getAllByPlaceholderText('用户名').length).toBeGreaterThan(0)
    expect(screen.getByPlaceholderText('密码')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('昵称')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('手机号')).toBeInTheDocument()
    expect(screen.getAllByPlaceholderText('邮箱').length).toBeGreaterThan(0)
  })

  it('stores system user locale keys and removes legacy english strings', () => {
    expect(en).toMatchObject({
      systemUsers: expect.objectContaining({
        title: 'System Users',
        newUser: 'New User',
      }),
    })

    expect(zh).toMatchObject({
      systemUsers: expect.objectContaining({
        title: '系统用户',
        newUser: '新增用户',
      }),
    })

    const source = readFileSync(
      path.join(path.resolve(import.meta.dirname), 'index.tsx'),
      'utf8'
    )

    expect(source).not.toContain('System Users')
    expect(source).not.toContain(
      'Manage tenant administrators and system access accounts.'
    )
    expect(source).not.toContain('New User')
    expect(source).not.toContain('Search by username')
    expect(source).not.toContain('Search by nickname')
    expect(source).not.toContain('Loading users...')
    expect(source).not.toContain('No users found.')
    expect(source).not.toContain('User updated')
    expect(source).not.toContain('User created')
    expect(source).not.toContain('Failed to load users')
    expect(source).not.toContain('Failed to save user')
    expect(source).not.toContain('User status updated')
    expect(source).not.toContain('Failed to update user')
    expect(source).not.toContain('Edit User')
    expect(source).not.toContain('Create User')
    expect(source).not.toContain('Password (leave blank to keep current)')
  })
})
