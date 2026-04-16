import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { DatePicker } from '@/components/date-picker'

type AccountFormValues = {
  name: string
  dob: Date
  language: string
}

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  name: '',
}

export function AccountForm() {
  const { t } = useTranslation()
  const languages = [
    { label: t('settings.account.languages.en'), value: 'en' },
    { label: t('settings.account.languages.fr'), value: 'fr' },
    { label: t('settings.account.languages.de'), value: 'de' },
    { label: t('settings.account.languages.es'), value: 'es' },
    { label: t('settings.account.languages.pt'), value: 'pt' },
    { label: t('settings.account.languages.ru'), value: 'ru' },
    { label: t('settings.account.languages.ja'), value: 'ja' },
    { label: t('settings.account.languages.ko'), value: 'ko' },
    { label: t('settings.account.languages.zh'), value: 'zh' },
  ] as const
  const accountFormSchema = z.object({
    name: z
      .string()
      .min(1, t('settings.account.validation.nameRequired'))
      .min(2, t('settings.account.validation.nameMinLength'))
      .max(30, t('settings.account.validation.nameMaxLength')),
    dob: z.date(t('settings.account.validation.dobRequired')),
    language: z.string(t('settings.account.validation.languageRequired')),
  })
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  function onSubmit(data: AccountFormValues) {
    showSubmittedData(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('settings.account.name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('settings.account.namePlaceholder')} {...field} />
              </FormControl>
              <FormDescription>
                {t('settings.account.nameDescription')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dob'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>{t('settings.account.dob')}</FormLabel>
              <DatePicker selected={field.value} onSelect={field.onChange} />
              <FormDescription>
                {t('settings.account.dobDescription')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='language'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>{t('settings.account.language')}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      role='combobox'
                      className={cn(
                        'w-[200px] justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? languages.find(
                            (language) => language.value === field.value
                          )?.label
                        : t('settings.account.selectLanguage')}
                      <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-[200px] p-0'>
                  <Command>
                    <CommandInput
                      placeholder={t('settings.account.searchLanguage')}
                    />
                    <CommandEmpty>
                      {t('settings.account.noLanguageFound')}
                    </CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              form.setValue('language', language.value)
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'size-4',
                                language.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {language.label}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                {t('settings.account.languageDescription')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>{t('settings.account.updateAccount')}</Button>
      </form>
    </Form>
  )
}
