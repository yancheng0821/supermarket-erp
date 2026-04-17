import { startTransition, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { LanguageSwitch } from '@/components/language-switch'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  DashboardViewSwitcher,
  type DashboardView,
} from './components/dashboard-view-switcher'
import { Analytics } from './components/analytics'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'

function DashboardPanel({
  panelKey,
  children,
}: {
  panelKey: DashboardView
  children: React.ReactNode
}) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setEntered(true)
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [panelKey])

  return (
    <div
      className={cn(
        'transition-all duration-200 ease-out',
        entered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
      )}
    >
      {children}
    </div>
  )
}

export function Dashboard() {
  const { t } = useTranslation()
  const [view, setView] = useState<DashboardView>('overview')

  const switcherLabels = {
    overview: t('dashboard.overview'),
    analytics: t('dashboard.analytics'),
  } satisfies Record<DashboardView, string>

  return (
    <>
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <LanguageSwitch />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>{t('dashboard.title')}</h1>
          <div className='flex items-center space-x-2'>
            <Button>{t('dashboard.download')}</Button>
          </div>
        </div>
        <div className='space-y-4'>
          <DashboardViewSwitcher
            labels={switcherLabels}
            onValueChange={(nextView) => {
              startTransition(() => {
                setView(nextView)
              })
            }}
            value={view}
          />
          {view === 'overview' ? (
            <DashboardPanel panelKey='overview'>
              <div className='space-y-4'>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>
                        {t('dashboard.totalRevenue')}
                      </CardTitle>
                      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                        <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>¥45,231.89</div>
                      <p className='text-xs text-muted-foreground'>
                        +20.1% {t('dashboard.fromLastMonth')}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>
                        {t('dashboard.totalOrders')}
                      </CardTitle>
                      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                        <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                        <circle cx='9' cy='7' r='4' />
                        <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>+2,350</div>
                      <p className='text-xs text-muted-foreground'>
                        +180.1% {t('dashboard.fromLastMonth')}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>{t('dashboard.totalProducts')}</CardTitle>
                      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                        <rect width='20' height='14' x='2' y='5' rx='2' />
                        <path d='M2 10h20' />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>+12,234</div>
                      <p className='text-xs text-muted-foreground'>
                        +19% {t('dashboard.fromLastMonth')}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>
                        {t('dashboard.totalMembers')}
                      </CardTitle>
                      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                        <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>+573</div>
                      <p className='text-xs text-muted-foreground'>
                        {t('dashboard.sinceLastHour')}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
                  <Card className='col-span-1 lg:col-span-4'>
                    <CardHeader>
                      <CardTitle>{t('dashboard.overview')}</CardTitle>
                    </CardHeader>
                    <CardContent className='ps-2'>
                      <Overview />
                    </CardContent>
                  </Card>
                  <Card className='col-span-1 lg:col-span-3'>
                    <CardHeader>
                      <CardTitle>{t('dashboard.recentSales')}</CardTitle>
                      <CardDescription>
                        {t('dashboard.salesThisMonth')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentSales />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </DashboardPanel>
          ) : (
            <DashboardPanel panelKey='analytics'>
              <Analytics />
            </DashboardPanel>
          )}
        </div>
      </Main>
    </>
  )
}
