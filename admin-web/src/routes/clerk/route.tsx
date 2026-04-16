/* eslint-disable react-refresh/only-export-components */
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ClerkProvider } from '@clerk/clerk-react'
import { ExternalLink, Key } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ConfigDrawer } from '@/components/config-drawer'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Main } from '@/components/layout/main'
import { LanguageSwitch } from '@/components/language-switch'
import { ThemeSwitch } from '@/components/theme-switch'

export const Route = createFileRoute('/clerk')({
  component: RouteComponent,
})

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function RouteComponent() {
  if (!PUBLISHABLE_KEY) {
    return <MissingClerkPubKey />
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl='/clerk/sign-in'
      signInUrl='/clerk/sign-in'
      signUpUrl='/clerk/sign-up'
      signInFallbackRedirectUrl='/clerk/user-management'
      signUpFallbackRedirectUrl='/clerk/user-management'
    >
      <Outlet />
    </ClerkProvider>
  )
}

function MissingClerkPubKey() {
  const { t } = useTranslation()
  const codeBlock =
    'bg-foreground/10 rounded-sm py-0.5 px-1 text-xs text-foreground font-bold'

  return (
    <AuthenticatedLayout>
      <div className='bg-background flex h-16 justify-between p-4'>
        <SidebarTrigger variant='outline' className='scale-125 sm:scale-100' />
        <div className='space-x-4'>
          <LanguageSwitch />
          <ThemeSwitch />
          <ConfigDrawer />
        </div>
      </div>
      <Main className='flex flex-col items-center justify-start'>
        <div className='max-w-2xl'>
          <Alert>
            <Key className='size-4' />
            <AlertTitle>{t('clerk.missingKeyTitle')}</AlertTitle>
            <AlertDescription>
              <p className='text-balance'>
                <Trans
                  i18nKey='clerk.missingKeyDescription'
                  components={{ code: <code className={codeBlock} /> }}
                />
              </p>
            </AlertDescription>
          </Alert>

          <h1 className='mt-4 text-2xl font-bold'>
            {t('clerk.setupKeyTitle')}
          </h1>
          <div className='mt-4 flex flex-col gap-y-4 text-foreground/75'>
            <ol className='list-inside list-decimal space-y-1.5'>
              <li>
                <Trans
                  i18nKey='clerk.apiKeysPageStep'
                  components={{
                    link: (
                      <a
                        href='https://go.clerk.com/GttUAaK'
                        target='_blank'
                        rel='noreferrer'
                        className='underline decoration-dashed underline-offset-4 hover:decoration-solid'
                      />
                    ),
                  }}
                />
                <sup>
                  <ExternalLink className='inline-block size-4' />
                </sup>
              </li>
              <li>
                <Trans
                  i18nKey='clerk.quickCopyStep'
                  components={{ strong: <strong /> }}
                />
              </li>
              <li>
                <Trans
                  i18nKey='clerk.renameEnvStep'
                  components={{ code: <code className={codeBlock} /> }}
                />
              </li>
              <li>
                <Trans
                  i18nKey='clerk.pasteKeyStep'
                  components={{ code: <code className={codeBlock} /> }}
                />
              </li>
            </ol>
            <p>{t('clerk.finalResultLabel')}</p>

            <div className='@container space-y-2 rounded-md bg-slate-800 px-3 py-3 text-sm text-slate-200'>
              <span className='ps-1'>.env</span>
              <pre className='overflow-auto overscroll-x-contain rounded bg-slate-950 px-2 py-1 text-xs'>
                <code>
                  <span className='before:text-slate-400 md:before:pe-2 md:before:content-["1."]'>
                    VITE_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
                  </span>
                </code>
              </pre>
            </div>
          </div>

          <Separator className='my-4 w-full' />

          <Alert>
            <AlertTitle>{t('clerk.optionalTitle')}</AlertTitle>
            <AlertDescription>
              <p className='text-balance'>
                <Trans
                  i18nKey='clerk.optionalDescription'
                  components={{ code: <code className={codeBlock} /> }}
                />
              </p>
              <p>
                <Trans
                  i18nKey='clerk.optionalRemovalDescription'
                  components={{ code: <code className={codeBlock} /> }}
                />
              </p>
              <p className='mt-2 text-sm'>
                {t('clerk.optionalNote')}
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </Main>
    </AuthenticatedLayout>
  )
}
