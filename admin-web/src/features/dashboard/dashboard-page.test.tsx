import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { Dashboard } from './index'

vi.mock('@/components/layout/header', () => ({
  Header: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/components/layout/main', () => ({
  Main: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}))

vi.mock('@/components/profile-dropdown', () => ({
  ProfileDropdown: () => <div data-testid='profile-dropdown' />,
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

vi.mock('./components/analytics', () => ({
  Analytics: () => <section data-testid='analytics-panel'>analytics-panel</section>,
}))

vi.mock('./components/overview', () => ({
  Overview: () => <section data-testid='overview-panel'>overview-panel</section>,
}))

vi.mock('./components/recent-sales', () => ({
  RecentSales: () => <section data-testid='recent-sales-panel'>recent-sales-panel</section>,
}))

describe('dashboard page', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh')
  })

  it('shows only overview and analytics as top-level views', () => {
    render(<Dashboard />)

    expect(screen.getByRole('tab', { name: '概览' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '分析' })).toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: '报表' })).not.toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: '通知' })).not.toBeInTheDocument()
  })

  it('switches to the analytics view from the top-level view switcher', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)

    expect(screen.getByTestId('overview-panel')).toBeInTheDocument()
    expect(screen.queryByTestId('analytics-panel')).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: '分析' }))

    expect(screen.getByTestId('analytics-panel')).toBeInTheDocument()
  })
})
