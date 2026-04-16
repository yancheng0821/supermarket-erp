import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'
import { PlatformTenantsPage } from './index'

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

describe('platform tenants i18n', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh')
    apiGetMock.mockReset()
    apiPostMock.mockReset()
    apiPutMock.mockReset()
    apiGetMock.mockResolvedValue({
      list: [
        {
          id: 1,
          code: 'freshmart',
          name: '鲜选超市',
          contactName: '张三',
          contactPhone: '13800000000',
          status: 0,
          expireDate: '2026-12-31',
        },
      ],
      total: 1,
    })
  })

  it('renders localized platform tenants page and dialog copy', async () => {
    render(<PlatformTenantsPage />)

    expect(screen.getByText('租户管理')).toBeInTheDocument()
    expect(
      screen.getByText('管理平台中的租户身份和生命周期状态。')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '新增租户' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('按租户编码搜索')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('按租户名称搜索')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '搜索' })).toBeInTheDocument()
    expect(screen.getByText('租户')).toBeInTheDocument()
    expect(screen.getByText('编码')).toBeInTheDocument()
    expect(screen.getByText('联系人')).toBeInTheDocument()
    expect(screen.getByText('手机号')).toBeInTheDocument()
    expect(screen.getAllByText('状态').length).toBeGreaterThan(0)
    expect(screen.getByText('到期日期')).toBeInTheDocument()
    expect(screen.getByText('操作')).toBeInTheDocument()
    expect(await screen.findByText('鲜选超市')).toBeInTheDocument()
    expect(screen.getByText('禁用')).toBeInTheDocument()
    expect(screen.getByText('共 1 条 | 第 1 / 1 页')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '新增租户' }))

    expect(screen.getByText('创建租户')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('租户编码')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('租户名称')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('联系人姓名')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('联系人手机号')).toBeInTheDocument()
  })

  it('stores platform tenant locale keys and removes legacy english strings', () => {
    expect(en).toMatchObject({
      platformTenants: expect.objectContaining({
        title: 'Tenant Management',
        newTenant: 'New Tenant',
      }),
    })

    expect(zh).toMatchObject({
      platformTenants: expect.objectContaining({
        title: '租户管理',
        newTenant: '新增租户',
      }),
    })

    const source = readFileSync(
      path.join(path.resolve(import.meta.dirname), 'index.tsx'),
      'utf8'
    )

    expect(source).not.toContain('Tenant Management')
    expect(source).not.toContain(
      'Manage tenant identities and lifecycle status for the platform.'
    )
    expect(source).not.toContain('New Tenant')
    expect(source).not.toContain('Search by tenant code')
    expect(source).not.toContain('Search by tenant name')
    expect(source).not.toContain('Loading tenants...')
    expect(source).not.toContain('No tenants found.')
    expect(source).not.toContain('Tenant updated')
    expect(source).not.toContain('Tenant created')
    expect(source).not.toContain('Failed to load tenants')
    expect(source).not.toContain('Failed to save tenant')
    expect(source).not.toContain('Tenant status updated')
    expect(source).not.toContain('Failed to update tenant status')
    expect(source).not.toContain('Edit Tenant')
    expect(source).not.toContain('Create Tenant')
    expect(source).not.toContain('Tenant Code')
    expect(source).not.toContain('Tenant Name')
    expect(source).not.toContain('Contact Name')
    expect(source).not.toContain('Contact Phone')
  })
})
