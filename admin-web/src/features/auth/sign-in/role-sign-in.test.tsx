import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { RoleSignIn } from './role-sign-in'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
}))

vi.mock('@/features/auth/api', () => ({
  platformLogin: vi.fn(),
  tenantLogin: vi.fn(),
}))

vi.mock('@/features/auth/session-bootstrap', () => ({
  bootstrapSession: vi.fn(),
}))

describe('role sign in shell', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh')
  })

  it('renders the tenant shell with a back link and tenant code field', () => {
    render(<RoleSignIn mode='tenant' redirectTo='/system/users' />)

    expect(screen.getByRole('heading', { name: '租户管理员' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '返回角色选择' })).toBeInTheDocument()
    expect(screen.getByLabelText('租户编码')).toBeInTheDocument()
  })

  it('renders the platform shell without the tenant code field', () => {
    render(<RoleSignIn mode='platform' redirectTo='/platform/menus' />)

    expect(screen.getByRole('heading', { name: '平台管理员' })).toBeInTheDocument()
    expect(screen.queryByLabelText('租户编码')).not.toBeInTheDocument()
    expect(screen.getByText('请输入您的账号和密码')).toBeInTheDocument()
  })
})
