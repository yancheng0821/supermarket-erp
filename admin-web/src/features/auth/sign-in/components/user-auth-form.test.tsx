import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { platformLogin, tenantLogin } from '@/features/auth/api'
import { bootstrapSession } from '@/features/auth/session-bootstrap'
import { useAuthStore } from '@/stores/auth-store'
import { UserAuthForm } from './user-auth-form'

const navigateMock = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
  useNavigate: () => navigateMock,
}))

vi.mock('@/features/auth/api', () => ({
  platformLogin: vi.fn(),
  tenantLogin: vi.fn(),
}))

vi.mock('@/features/auth/session-bootstrap', () => ({
  bootstrapSession: vi.fn(),
}))

const mockedPlatformLogin = vi.mocked(platformLogin)
const mockedTenantLogin = vi.mocked(tenantLogin)
const mockedBootstrapSession = vi.mocked(bootstrapSession)

describe('user auth form', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh')
    navigateMock.mockReset()
    mockedPlatformLogin.mockReset()
    mockedTenantLogin.mockReset()
    mockedBootstrapSession.mockReset()
    useAuthStore.getState().reset()
  })

  it('renders localized labels for the default tenant login mode', () => {
    render(<UserAuthForm />)

    expect(screen.getByRole('tab', { name: '租户管理员' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '平台管理员' })).toBeInTheDocument()
    expect(screen.getByLabelText('租户编码')).toBeInTheDocument()
    expect(screen.getByLabelText('用户名')).toBeInTheDocument()
    expect(screen.getByLabelText('密码')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument()
  })

  it('requires tenant code before submitting a tenant login', async () => {
    const user = userEvent.setup()
    render(<UserAuthForm />)

    await user.type(screen.getByLabelText('用户名'), 'admin')
    await user.type(screen.getByLabelText('密码'), 'admin1234')
    await user.click(screen.getByRole('button', { name: '登录' }))

    expect(await screen.findByText('请输入租户编码')).toBeInTheDocument()
    expect(mockedTenantLogin).not.toHaveBeenCalled()
  })

  it('submits platform credentials and redirects after login', async () => {
    const user = userEvent.setup()
    mockedPlatformLogin.mockResolvedValue({
      token: 'platform-token',
      userId: 99,
      nickname: 'Platform Admin',
      loginScope: 'platform',
    })
    mockedBootstrapSession.mockResolvedValue({
      loginScope: 'platform',
      user: {
        userId: 99,
        username: 'platform-admin',
        nickname: 'Platform Admin',
      },
      tenant: null,
      permissions: ['platform:tenant:page'],
      menuTree: [],
    })

    render(<UserAuthForm redirectTo='/platform/menus' />)

    await user.click(screen.getByRole('tab', { name: '平台管理员' }))
    await user.type(screen.getByLabelText('用户名'), 'platform-admin')
    await user.type(screen.getByLabelText('密码'), 'admin1234')
    await user.click(screen.getByRole('button', { name: '登录' }))

    await waitFor(() => {
      expect(mockedPlatformLogin).toHaveBeenCalledWith({
        username: 'platform-admin',
        password: 'admin1234',
      })
    })
    expect(useAuthStore.getState().token).toBe('platform-token')
    expect(mockedBootstrapSession).toHaveBeenCalledWith(true)
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/platform/menus',
      replace: true,
    })
  })

  it('submits tenant credentials and keeps the redirect target', async () => {
    const user = userEvent.setup()
    mockedTenantLogin.mockResolvedValue({
      token: 'tenant-token',
      userId: 1,
      nickname: 'Tenant Admin',
      loginScope: 'tenant',
    })
    mockedBootstrapSession.mockResolvedValue({
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
      menuTree: [],
    })

    render(<UserAuthForm redirectTo='/system/users' />)

    await user.type(screen.getByLabelText('租户编码'), 'freshmart-sh')
    await user.type(screen.getByLabelText('用户名'), 'admin')
    await user.type(screen.getByLabelText('密码'), 'admin1234')
    await user.click(screen.getByRole('button', { name: '登录' }))

    await waitFor(() => {
      expect(mockedTenantLogin).toHaveBeenCalledWith({
        tenantCode: 'freshmart-sh',
        username: 'admin',
        password: 'admin1234',
      })
    })
    expect(useAuthStore.getState().token).toBe('tenant-token')
    expect(mockedBootstrapSession).toHaveBeenCalledWith(true)
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/system/users',
      replace: true,
    })
  })
})
