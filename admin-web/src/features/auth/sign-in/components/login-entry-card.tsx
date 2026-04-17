import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type LoginEntryCardProps = {
  title: string
  description: string
  actionLabel: string
  to: string
  badges: string[]
  accent?: 'light' | 'dark'
  icon?: ReactNode
  search?: Record<string, string>
}

export function LoginEntryCard({
  title,
  description,
  actionLabel,
  to,
  badges,
  accent = 'light',
  icon,
  search,
}: LoginEntryCardProps) {
  return (
    <Link
      to={to}
      search={search}
      aria-label={actionLabel}
      className={cn(
        'group relative block overflow-hidden rounded-[28px] border p-6 shadow-xl transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40',
        accent === 'dark'
          ? 'border-[#203227]/40 bg-[#1f2d27] text-white shadow-black/10'
          : 'border-white/70 bg-white/88 text-foreground shadow-black/5 backdrop-blur'
      )}
    >
      <div className='flex h-full flex-col'>
        <div
          className={cn(
            'inline-flex size-12 items-center justify-center rounded-2xl',
            accent === 'dark'
              ? 'bg-white/10 text-white'
              : 'bg-[#173324]/6 text-[#173324]'
          )}
        >
          {icon}
        </div>
        <div className='mt-8 space-y-3'>
          <h2 className='text-2xl font-semibold tracking-tight'>{title}</h2>
          <p
            className={cn(
              'max-w-sm text-sm leading-7',
              accent === 'dark' ? 'text-white/78' : 'text-muted-foreground'
            )}
          >
            {description}
          </p>
        </div>
        <div className='mt-6 flex flex-wrap gap-2'>
          {badges.map((badge) => (
            <span
              key={badge}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium',
                accent === 'dark'
                  ? 'bg-white/10 text-white/85'
                  : 'bg-[#173324]/6 text-[#173324]'
              )}
            >
              {badge}
            </span>
          ))}
        </div>
        <div
          className={cn(
            'mt-auto flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-colors',
            accent === 'dark'
              ? 'border-white/10 bg-white/6 text-white'
              : 'border-border/80 bg-[#f4f6f4] text-foreground'
          )}
        >
          <span>{actionLabel}</span>
          <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
        </div>
      </div>
    </Link>
  )
}
