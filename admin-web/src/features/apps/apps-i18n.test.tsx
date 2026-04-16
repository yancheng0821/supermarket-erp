import { readFileSync } from 'node:fs'
import path from 'node:path'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'
import { Apps } from './index'

const navigateMock = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  getRouteApi: () => ({
    useSearch: () => ({}),
    useNavigate: () => navigateMock,
  }),
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

describe('apps i18n', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh')
    navigateMock.mockReset()
  })

  it('renders localized app integration copy', () => {
    render(<Apps />)

    expect(screen.getByText('应用集成')).toBeInTheDocument()
    expect(screen.getByText('这里是可接入应用列表。')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('筛选应用...')).toBeInTheDocument()
    expect(screen.getByText('全部应用')).toBeInTheDocument()
    expect(screen.getByText('连接 Telegram 以进行实时沟通。')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '连接' }).length).toBeGreaterThan(0)
    expect(
      screen.getAllByRole('button', { name: '已连接' }).length
    ).toBeGreaterThan(0)
  })

  it('stores apps translation keys and removes legacy english strings', () => {
    expect(en).toMatchObject({
      apps: expect.objectContaining({
        title: 'App Integrations',
        filterPlaceholder: 'Filter apps...',
        connect: 'Connect',
      }),
    })

    expect(zh).toMatchObject({
      apps: expect.objectContaining({
        title: '应用集成',
        filterPlaceholder: '筛选应用...',
        connect: '连接',
      }),
    })

    const sourceDir = path.resolve(import.meta.dirname)
    const appsSource = readFileSync(path.join(sourceDir, 'index.tsx'), 'utf8')
    const appsData = readFileSync(
      path.join(sourceDir, 'data', 'apps.tsx'),
      'utf8'
    )

    expect(appsSource).not.toContain('App Integrations')
    expect(appsSource).not.toContain("Here's a list of your apps for the integration!")
    expect(appsSource).not.toContain('Filter apps...')
    expect(appsSource).not.toContain('All Apps')
    expect(appsSource).not.toContain('Ascending')
    expect(appsSource).not.toContain('Descending')

    expect(appsData).not.toContain(
      'Connect with Telegram for real-time communication.'
    )
    expect(appsData).not.toContain(
      'Effortlessly sync Notion pages for seamless collaboration.'
    )
  })
})
