import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { Settings } from './index'
import { SettingsAccount } from './account'
import { SettingsAppearance } from './appearance'
import { SettingsDisplay } from './display'
import { SettingsNotifications } from './notifications'
import { SettingsProfile } from './profile'

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
  Outlet: () => <div data-testid='settings-outlet' />,
  useLocation: () => ({ pathname: '/settings' }),
  useNavigate: () => navigateMock,
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

vi.mock('@/components/search', () => ({
  Search: () => <div data-testid='search' />,
}))

vi.mock('@/components/language-switch', () => ({
  LanguageSwitch: () => <div data-testid='language-switch' />,
}))

vi.mock('@/components/theme-switch', () => ({
  ThemeSwitch: () => <div data-testid='theme-switch' />,
}))

vi.mock('@/components/config-drawer', () => ({
  ConfigDrawer: () => <div data-testid='config-drawer' />,
}))

vi.mock('@/components/profile-dropdown', () => ({
  ProfileDropdown: () => <div data-testid='profile-dropdown' />,
}))

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/components/date-picker', () => ({
  DatePicker: () => <div data-testid='date-picker' />,
}))

vi.mock('@/context/font-provider', () => ({
  useFont: () => ({
    font: 'inter',
    setFont: vi.fn(),
  }),
}))

vi.mock('@/context/theme-provider', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}))

vi.mock('@/lib/show-submitted-data', () => ({
  showSubmittedData: vi.fn(),
}))

describe('settings i18n', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh')
    navigateMock.mockReset()
  })

  it('renders localized settings shell and sidebar items', () => {
    render(<Settings />)

    expect(screen.getByText('设置')).toBeInTheDocument()
    expect(
      screen.getByText('管理账号设置并配置邮件偏好。')
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /个人资料/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /账号/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /外观/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /通知/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /显示/ })).toBeInTheDocument()
  })

  it('renders localized account and appearance forms', () => {
    render(
      <>
        <SettingsAccount />
        <SettingsAppearance />
      </>
    )

    expect(screen.getByText('姓名')).toBeInTheDocument()
    expect(screen.getByText('出生日期')).toBeInTheDocument()
    expect(screen.getByText('语言')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '更新账号' })).toBeInTheDocument()
    expect(screen.getByText('字体')).toBeInTheDocument()
    expect(screen.getByText('主题')).toBeInTheDocument()
    expect(screen.getByText('浅色')).toBeInTheDocument()
    expect(screen.getByText('深色')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '更新偏好' })).toBeInTheDocument()
  })

  it('renders localized display and notifications forms', () => {
    render(
      <>
        <SettingsDisplay />
        <SettingsNotifications />
      </>
    )

    expect(screen.getByText('侧边栏')).toBeInTheDocument()
    expect(screen.getByText('最近使用')).toBeInTheDocument()
    expect(screen.getByText('首页')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '更新显示设置' })).toBeInTheDocument()
    expect(screen.getByText('通知我以下内容...')).toBeInTheDocument()
    expect(screen.getByText('邮件通知')).toBeInTheDocument()
    expect(screen.getByText('全部新消息')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '更新通知设置' })).toBeInTheDocument()
  })

  it('renders localized profile form', () => {
    render(<SettingsProfile />)

    expect(screen.getByText('用户名')).toBeInTheDocument()
    expect(screen.getByText('邮箱')).toBeInTheDocument()
    expect(screen.getByText('简介')).toBeInTheDocument()
    expect(screen.getAllByText('链接')[0]).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '新增链接' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '更新资料' })).toBeInTheDocument()
  })
})
