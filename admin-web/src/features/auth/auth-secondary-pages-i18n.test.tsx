import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { ForgotPassword } from './forgot-password'
import { Otp } from './otp'
import { SignIn2 } from './sign-in/sign-in-2'
import { SignUp } from './sign-up'

const navigateMock = vi.fn()

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
  useNavigate: () => navigateMock,
}))

vi.mock('@/features/auth/api', () => ({
  platformLogin: vi.fn(),
  tenantLogin: vi.fn(),
}))

vi.mock('@/features/auth/session-bootstrap', () => ({
  bootstrapSession: vi.fn(),
}))

describe('secondary auth pages i18n', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh')
    navigateMock.mockReset()
  })

  it('renders localized copy on the sign up page', () => {
    render(<SignUp />)

    expect(screen.getAllByText('创建账号').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByRole('link', { name: '登录' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '服务条款' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '隐私政策' })).toBeInTheDocument()
  })

  it('shows localized validation on the sign up form', async () => {
    const user = userEvent.setup()
    render(<SignUp />)

    await user.click(screen.getByRole('button', { name: '创建账号' }))

    expect(await screen.findByText('请输入邮箱')).toBeInTheDocument()
    expect(screen.getByText('请输入密码')).toBeInTheDocument()
    expect(screen.getByText('请确认密码')).toBeInTheDocument()
  })

  it('renders localized copy on the forgot password page', () => {
    render(<ForgotPassword />)

    expect(screen.getByText('找回密码')).toBeInTheDocument()
    expect(screen.getByText('请输入已注册邮箱，我们会发送重置密码链接。')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '注册' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '发送重置链接' })).toBeInTheDocument()
  })

  it('shows localized validation on the forgot password form', async () => {
    const user = userEvent.setup()
    render(<ForgotPassword />)

    await user.click(screen.getByRole('button', { name: '发送重置链接' }))

    expect(await screen.findByText('请输入邮箱')).toBeInTheDocument()
  })

  it('renders localized copy on the otp page', () => {
    render(<Otp />)

    expect(screen.getByText('双重身份验证')).toBeInTheDocument()
    expect(screen.getByText('请输入验证码。我们已将验证码发送至您的邮箱。')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '验证' })).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: '重新发送验证码' })
    ).toBeInTheDocument()
  })

  it('renders localized copy on the alternate sign in page', () => {
    render(<SignIn2 />)

    expect(screen.getByRole('heading', { name: '登录' })).toBeInTheDocument()
    expect(
      screen.getByText('请选择平台或租户模式，然后输入账号密码继续。')
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '服务条款' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '隐私政策' })).toBeInTheDocument()
  })
})
