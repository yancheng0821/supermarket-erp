import { useState } from 'react'
import { useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import dashboardDark from './assets/dashboard-dark.png'
import dashboardLight from './assets/dashboard-light.png'
import { type LoginMode, UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in/' })
  const { t } = useTranslation()
  const [mode, setMode] = useState<LoginMode>('tenant')

  const isTenant = mode === 'tenant'
  const nextMode = isTenant ? 'platform' : 'tenant'

  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
          <div className='mx-auto flex w-full max-w-sm flex-col justify-center space-y-2'>
            <div className='flex flex-col space-y-2 text-start'>
              <h2 className='text-lg font-semibold tracking-tight'>
                {isTenant ? t('auth.tenantAdmin') : t('auth.platformAdmin')}
              </h2>
              <p className='text-sm text-muted-foreground'>
                {isTenant
                  ? t('auth.tenantRoleDescription')
                  : t('auth.platformRoleDescription')}
              </p>
            </div>
            <UserAuthForm key={mode} mode={mode} redirectTo={redirect} />
            <div className='pt-1 text-center'>
              <button
                type='button'
                onClick={() => {
                  setMode(nextMode)
                }}
                className='inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
              >
                {isTenant
                  ? t('auth.switchToPlatformAdminSignIn')
                  : t('auth.switchToTenantAdminSignIn')}
              </button>
            </div>
            <p className='px-8 text-center text-sm text-muted-foreground'>
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
          </div>
        </div>
      </div>
      <div className='relative h-full overflow-hidden bg-muted max-lg:hidden'>
        <img
          src={dashboardLight}
          className='absolute top-[15%] left-20 h-full w-full object-cover object-top-left select-none dark:hidden'
          width={1024}
          height={1151}
          alt={t('app.name')}
        />
        <img
          src={dashboardDark}
          className='absolute top-[15%] left-20 hidden h-full w-full object-cover object-top-left select-none dark:block'
          width={1024}
          height={1138}
          alt={t('app.name')}
        />
      </div>
    </div>
  )
}
