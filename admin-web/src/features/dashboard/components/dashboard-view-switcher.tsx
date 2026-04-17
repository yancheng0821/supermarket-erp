import { cn } from '@/lib/utils'

export type DashboardView = 'overview' | 'analytics'

type DashboardViewSwitcherProps = {
  value: DashboardView
  onValueChange: (value: DashboardView) => void
  labels: Record<DashboardView, string>
}

const views: DashboardView[] = ['overview', 'analytics']

export function DashboardViewSwitcher({
  value,
  onValueChange,
  labels,
}: DashboardViewSwitcherProps) {
  return (
    <div className='w-full overflow-x-auto pb-2'>
      <div
        aria-label='dashboard views'
        className='inline-flex min-w-fit items-center gap-1 rounded-2xl bg-[#edf1ed] p-1 shadow-inner shadow-emerald-950/5'
        role='tablist'
      >
        {views.map((view) => {
          const active = value === view

          return (
            <button
              key={view}
              aria-selected={active}
              className={cn(
                'min-w-[116px] rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30',
                active
                  ? 'bg-white text-foreground shadow-sm shadow-black/5'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => onValueChange(view)}
              role='tab'
              type='button'
            >
              {labels[view]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
