import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

type DisplayFormValues = {
  items: string[]
}

// This can come from your database or API.
const defaultValues: Partial<DisplayFormValues> = {
  items: ['recents', 'home'],
}

export function DisplayForm() {
  const { t } = useTranslation()
  const items = [
    {
      id: 'recents',
      label: t('settings.display.items.recents'),
    },
    {
      id: 'home',
      label: t('settings.display.items.home'),
    },
    {
      id: 'applications',
      label: t('settings.display.items.applications'),
    },
    {
      id: 'desktop',
      label: t('settings.display.items.desktop'),
    },
    {
      id: 'downloads',
      label: t('settings.display.items.downloads'),
    },
    {
      id: 'documents',
      label: t('settings.display.items.documents'),
    },
  ] as const
  const displayFormSchema = z.object({
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: t('settings.display.validation.itemsRequired'),
    }),
  })
  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='items'
          render={() => (
            <FormItem>
              <div className='mb-4'>
                <FormLabel className='text-base'>
                  {t('settings.display.sidebar')}
                </FormLabel>
                <FormDescription>
                  {t('settings.display.sidebarDescription')}
                </FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name='items'
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className='flex flex-row items-start'
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>{t('settings.display.updateDisplay')}</Button>
      </form>
    </Form>
  )
}
