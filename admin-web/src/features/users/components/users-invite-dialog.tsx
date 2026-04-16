import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MailPlus, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import { roles } from '../data/data'

type UserInviteForm = {
  email: string
  role: string
  desc?: string
}

type UserInviteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersInviteDialog({
  open,
  onOpenChange,
}: UserInviteDialogProps) {
  const { t } = useTranslation()
  const formSchema = z.object({
    email: z
      .string()
      .trim()
      .min(1, t('users.emailRequired'))
      .email(t('users.emailInvalid')),
    role: z.string().min(1, t('users.roleRequired')),
    desc: z.string().optional(),
  })
  const form = useForm<UserInviteForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', role: '', desc: '' },
  })

  const onSubmit = (values: UserInviteForm) => {
    form.reset()
    showSubmittedData(values, t('users.inviteSummary'))
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle className='flex items-center gap-2'>
            <MailPlus /> {t('users.inviteUser')}
          </DialogTitle>
          <DialogDescription>{t('users.inviteDescription')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='user-invite-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users.email')}</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder={t('users.inviteEmailPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users.role')}</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder={t('common.select')}
                    items={roles.map(({ labelKey, value }) => ({
                      label: t(labelKey),
                      value,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='desc'
              render={({ field }) => (
                <FormItem className=''>
                  <FormLabel>{t('users.inviteOptionalDescription')}</FormLabel>
                  <FormControl>
                    <Textarea
                      className='resize-none'
                      placeholder={t('users.inviteOptionalPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='gap-y-2'>
          <DialogClose asChild>
            <Button variant='outline'>{t('common.cancel')}</Button>
          </DialogClose>
          <Button type='submit' form='user-invite-form'>
            {t('users.inviteUser')} <Send />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
