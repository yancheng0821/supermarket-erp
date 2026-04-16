import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { ForgotPasswordForm } from './components/forgot-password-form'

export function ForgotPassword() {
  const { t } = useTranslation()

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            {t('auth.forgotPasswordTitle')}
          </CardTitle>
          <CardDescription>{t('auth.forgotPasswordDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
        <CardFooter>
          <p className='mx-auto px-8 text-center text-sm text-balance text-muted-foreground'>
            {t('auth.noAccount')}{' '}
            <Link
              to='/sign-up'
              className='underline underline-offset-4 hover:text-primary'
            >
              {t('auth.signUp')}
            </Link>
            {t('auth.agreeSuffix')}
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
