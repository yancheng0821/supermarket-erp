import { Link } from '@tanstack/react-router'
import { ArrowLeft, Building2, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import {
  UserAuthForm,
  type LoginMode,
} from './components/user-auth-form'

type RoleSignInProps = {
  mode: LoginMode
  redirectTo?: string
}

export function RoleSignIn({ mode, redirectTo }: RoleSignInProps) {
  const { t } = useTranslation()
  const isTenant = mode === 'tenant'

  const title = isTenant ? t('auth.tenantAdmin') : t('auth.platformAdmin')
  const description = isTenant
    ? t('auth.tenantRoleDescription')
    : t('auth.platformRoleDescription')
  const helperItems = isTenant
    ? [
        t('auth.tenantEntryFeature1'),
        t('auth.tenantEntryFeature2'),
        t('auth.tenantEntryFeature3'),
      ]
    : [
        t('auth.platformEntryFeature1'),
        t('auth.platformEntryFeature2'),
        t('auth.platformEntryFeature3'),
      ]

  return (
    <AuthLayout contentClassName='max-w-6xl'>
      <div className='grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch'>
        <Card className='border-white/70 bg-white/78 shadow-xl shadow-black/5 backdrop-blur'>
          <CardHeader className='gap-5'>
            <div className='flex items-center gap-3'>
              <div className='flex size-12 items-center justify-center rounded-2xl bg-[#173324]/6 text-[#173324]'>
                {isTenant ? <Building2 className='size-5' /> : <ShieldCheck className='size-5' />}
              </div>
              <div className='space-y-1'>
                <p className='text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground'>
                  {t('auth.entryEyebrow')}
                </p>
                <h2 className='text-3xl font-semibold tracking-tight text-foreground'>{title}</h2>
              </div>
            </div>
            <CardDescription className='max-w-lg text-base leading-7 text-muted-foreground'>
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid gap-3 sm:grid-cols-3'>
              {helperItems.map((item) => (
                <div
                  key={item}
                  className='rounded-2xl border border-border/80 bg-[#f5f7f5] px-4 py-3 text-sm font-medium text-foreground'
                >
                  {item}
                </div>
              ))}
            </div>
            <div className='rounded-3xl bg-[#173324] px-5 py-6 text-white'>
              <p className='text-sm font-medium text-white/72'>{t('auth.entryFooterTitle')}</p>
              <p className='mt-3 text-lg font-semibold leading-8'>{t('auth.rolePanelHeadline')}</p>
              <p className='mt-3 text-sm leading-7 text-white/78'>{t('auth.rolePanelDescription')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/70 bg-white/90 shadow-xl shadow-black/5 backdrop-blur'>
          <CardHeader className='gap-4'>
            <Link
              to='/sign-in'
              search={redirectTo ? { redirect: redirectTo } : undefined}
              className='inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
            >
              <ArrowLeft className='size-4' />
              {t('auth.backToRoleSelection')}
            </Link>
            <div className='space-y-2'>
              <CardTitle className='text-2xl tracking-tight text-foreground'>{title}</CardTitle>
              <CardDescription className='text-base leading-7 text-muted-foreground'>
                {t('auth.enterCredentials')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            <UserAuthForm mode={mode} redirectTo={redirectTo} />
            <p className='px-4 text-center text-sm text-muted-foreground'>
              {t('auth.agreePrefix')}{' '}
              <a
                href='/terms'
                className='underline underline-offset-4 hover:text-primary'
              >
                {t('auth.termsOfService')}
              </a>{' '}
              {t('auth.agreeJoiner')}{' '}
              <a
                href='/privacy'
                className='underline underline-offset-4 hover:text-primary'
              >
                {t('auth.privacyPolicy')}
              </a>
              {t('auth.agreeSuffix')}
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  )
}
