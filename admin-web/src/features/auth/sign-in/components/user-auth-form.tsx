import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { platformLogin, tenantLogin } from '@/features/auth/api'
import { bootstrapSession } from '@/features/auth/session-bootstrap'
import { useAuthStore } from '@/stores/auth-store'
import { handleServerError } from '@/lib/handle-server-error'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type LoginMode = 'tenant' | 'platform'
type UserAuthFormValues = {
  tenantCode?: string
  username: string
  password: string
}

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<LoginMode>('tenant')
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setToken = useAuthStore((state) => state.setToken)
  const formSchema = z.object({
    tenantCode: z.string().optional(),
    username: z.string().trim().min(1, t('auth.usernameRequired')),
    password: z
      .string()
      .min(1, t('auth.passwordRequired'))
      .min(7, t('auth.passwordMinLength')),
  })

  const form = useForm<UserAuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantCode: '',
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (mode === 'tenant' && !data.tenantCode?.trim()) {
      form.setError('tenantCode', {
        type: 'manual',
        message: t('auth.tenantCodeRequired'),
      })
      return
    }

    setIsLoading(true)

    try {
      const result =
        mode === 'platform'
          ? await platformLogin({
              username: data.username.trim(),
              password: data.password,
            })
          : await tenantLogin({
              tenantCode: data.tenantCode!.trim(),
              username: data.username.trim(),
              password: data.password,
            })

      setToken(result.token)
      await bootstrapSession(true)

      toast.success(t('auth.welcomeBackUser', { name: result.nickname }))
      navigate({ to: redirectTo || '/', replace: true })
    } catch (error) {
      handleServerError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <Tabs
          value={mode}
          onValueChange={(value) => {
            setMode(value as LoginMode)
            form.clearErrors()
          }}
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='tenant'>{t('auth.tenantAdmin')}</TabsTrigger>
            <TabsTrigger value='platform'>{t('auth.platformAdmin')}</TabsTrigger>
          </TabsList>
        </Tabs>
        {mode === 'tenant' && (
          <FormField
            control={form.control}
            name='tenantCode'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.tenantCode')}</FormLabel>
                <FormControl>
                  <Input placeholder='freshmart-sh' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.username')}</FormLabel>
              <FormControl>
                <Input placeholder='admin' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>{t('auth.password')}</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='absolute end-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75'
              >
                {t('auth.forgotPassword')}
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          {t('auth.signIn')}
        </Button>
      </form>
    </Form>
  )
}
