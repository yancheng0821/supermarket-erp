import { readFileSync } from 'node:fs'
import path from 'node:path'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'
import { Analytics } from './components/analytics'
import { RecentSales } from './components/recent-sales'

vi.mock('./components/analytics-chart', () => ({
  AnalyticsChart: () => <div data-testid='analytics-chart' />,
}))

describe('dashboard i18n', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh')
  })

  it('renders localized analytics and recent sales copy', () => {
    render(
      <>
        <Analytics />
        <RecentSales />
      </>
    )

    expect(screen.getByText('流量概览')).toBeInTheDocument()
    expect(screen.getByText('每周点击量和独立访客')).toBeInTheDocument()
    expect(screen.getByText('总点击量')).toBeInTheDocument()
    expect(screen.getByText('独立访客')).toBeInTheDocument()
    expect(screen.getByText('跳出率')).toBeInTheDocument()
    expect(screen.getByText('平均会话时长')).toBeInTheDocument()
    expect(screen.getByText('来源渠道')).toBeInTheDocument()
    expect(screen.getByText('主要来源渠道流量贡献')).toBeInTheDocument()
    expect(screen.getByText('设备分布')).toBeInTheDocument()
    expect(screen.getByText('用户访问设备占比')).toBeInTheDocument()
    expect(screen.getByText('直接访问')).toBeInTheDocument()
    expect(screen.getByText('移动端')).toBeInTheDocument()
    expect(screen.getByText('王一诺')).toBeInTheDocument()
    expect(screen.getByText('anan.wang@email.com')).toBeInTheDocument()
  })

  it('stores dashboard locale keys and removes legacy english strings from source', () => {
    expect(en).toMatchObject({
      dashboard: expect.objectContaining({
        analyticsPanel: expect.objectContaining({
          trafficTitle: 'Traffic Overview',
          devices: expect.objectContaining({
            title: 'Devices',
          }),
        }),
        recentSalesPanel: expect.objectContaining({
          items: expect.objectContaining({
            customer1: expect.objectContaining({
              name: 'Olivia Martin',
            }),
          }),
        }),
      }),
    })

    expect(zh).toMatchObject({
      dashboard: expect.objectContaining({
        analyticsPanel: expect.objectContaining({
          trafficTitle: '流量概览',
          devices: expect.objectContaining({
            title: '设备分布',
          }),
        }),
        recentSalesPanel: expect.objectContaining({
          items: expect.objectContaining({
            customer1: expect.objectContaining({
              name: '王一诺',
            }),
          }),
        }),
      }),
    })

    const sourceDir = path.resolve(import.meta.dirname, 'components')
    const sourceFiles = [
      'analytics.tsx',
      'analytics-chart.tsx',
      'overview.tsx',
      'recent-sales.tsx',
    ]

    const sources = sourceFiles
      .map((file) => readFileSync(path.join(sourceDir, file), 'utf8'))
      .join('\n')

    expect(sources).not.toContain('Traffic Overview')
    expect(sources).not.toContain('Weekly clicks and unique visitors')
    expect(sources).not.toContain('Total Clicks')
    expect(sources).not.toContain('Unique Visitors')
    expect(sources).not.toContain('Bounce Rate')
    expect(sources).not.toContain('Avg. Session')
    expect(sources).not.toContain('Referrers')
    expect(sources).not.toContain('Devices')
    expect(sources).not.toContain('Mon')
    expect(sources).not.toContain('Jan')
    expect(sources).not.toContain('Olivia Martin')
    expect(sources).not.toContain("alt='Avatar'")
  })
})
