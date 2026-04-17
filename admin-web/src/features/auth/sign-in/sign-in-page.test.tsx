import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { SignIn } from './index'

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
  useSearch: () => ({ redirect: undefined }),
}))

vi.mock('@/features/auth/api', () => ({
  platformLogin: vi.fn(),
  tenantLogin: vi.fn(),
}))

vi.mock('@/features/auth/session-bootstrap', () => ({
  bootstrapSession: vi.fn(),
}))

describe('sign in page', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh')
  })

  it('renders the original sign-in-2 style tenant sign in layout', () => {
    render(<SignIn />)

    expect(
      screen.getByRole('heading', { name: '租户管理员' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        '使用租户编码和账号密码进入业务控制台，处理门店经营、库存、采购、会员和财务执行。'
      )
    ).toBeInTheDocument()
    expect(screen.getByLabelText('租户编码')).toBeInTheDocument()
    expect(screen.getByLabelText('用户名')).toBeInTheDocument()
    expect(screen.getByLabelText('密码')).toBeInTheDocument()
    expect(
      screen.queryByRole('tab', { name: '租户登录' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('tab', { name: '平台登录' })
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: '服务条款' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '隐私政策' })).toBeInTheDocument()
    const signInButton = screen.getByRole('button', { name: '登录' })
    const switchButton = screen.getByRole('button', {
      name: '切换到平台管理员登录',
    })
    const termsLink = screen.getByRole('link', { name: '服务条款' })

    expect(switchButton).toBeInTheDocument()
    expect(
      signInButton.compareDocumentPosition(switchButton) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
    expect(
      switchButton.compareDocumentPosition(termsLink) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it('switches the form in place when clicking the lightweight platform entry', async () => {
    const user = userEvent.setup()
    render(<SignIn />)

    await user.click(
      screen.getByRole('button', { name: '切换到平台管理员登录' })
    )

    expect(
      screen.getByRole('heading', { name: '平台管理员' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        '使用平台账号进入治理控制台，管理租户、角色、菜单、权限以及平台级系统配置。'
      )
    ).toBeInTheDocument()
    expect(screen.queryByLabelText('租户编码')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '切换到租户管理员登录' })
    ).toBeInTheDocument()
  })
})
