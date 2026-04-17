import { Logo } from '@/assets/logo'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

type AuthLayoutProps = {
  children: React.ReactNode
  contentClassName?: string
}

export function AuthLayout({ children, contentClassName }: AuthLayoutProps) {
  const { t } = useTranslation()

  return (
    <div className='relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(22,54,38,0.14),_transparent_34%),linear-gradient(180deg,#f7f6f1_0%,#f1efe8_46%,#edf1ed_100%)]'>
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute left-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl' />
        <div className='absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-950/10 blur-3xl' />
      </div>
      <div className='relative mx-auto flex min-h-dvh w-full items-center justify-center px-4 py-10 sm:px-6 lg:px-8'>
        <div className={cn('w-full max-w-md', contentClassName)}>
          <div className='mb-6 flex items-center justify-center gap-3'>
            <div className='flex size-11 items-center justify-center rounded-2xl bg-white/80 shadow-sm ring-1 ring-black/5 backdrop-blur'>
              <Logo className='size-5' />
            </div>
            <div className='space-y-1 text-center'>
              <p className='text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground'>
                Supermarket ERP
              </p>
              <h1 className='text-xl font-semibold tracking-tight'>{t('app.name')}</h1>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
