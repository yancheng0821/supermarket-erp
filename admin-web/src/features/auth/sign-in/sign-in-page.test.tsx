import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { SignIn } from './index'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
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

  it('renders localized page copy', () => {
    render(<SignIn />)

    expect(screen.getAllByText('登录').length).toBeGreaterThanOrEqual(2)
    expect(
      screen.getByText('请选择平台或租户模式，然后输入账号密码继续。')
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '服务条款' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '隐私政策' })).toBeInTheDocument()
  })
})
