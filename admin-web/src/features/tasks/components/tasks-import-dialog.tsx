import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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

function createFormSchema(t: (key: string) => string) {
  return z.object({
    file: z
      .instanceof(FileList)
      .refine((files) => files.length > 0, {
        message: t('tasks.validation.fileRequired'),
      })
      .refine(
        (files) => ['text/csv'].includes(files?.[0]?.type),
        t('tasks.validation.csvOnly')
      ),
  })
}

type TaskImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TasksImportDialog({
  open,
  onOpenChange,
}: TaskImportDialogProps) {
  const { t } = useTranslation()
  const formSchema = createFormSchema(t)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { file: undefined },
  })

  const fileRef = form.register('file')

  const onSubmit = () => {
    const file = form.getValues('file')

    if (file && file[0]) {
      const fileDetails = {
        name: file[0].name,
        size: file[0].size,
        type: file[0].type,
      }
      showSubmittedData(fileDetails, t('tasks.messages.importedFileSummary'))
    }
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        form.reset()
      }}
    >
      <DialogContent className='gap-2 sm:max-w-sm'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('tasks.importTasks')}</DialogTitle>
          <DialogDescription>{t('tasks.importDescription')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='task-import-form' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='file'
              render={() => (
                <FormItem className='my-2'>
                  <FormLabel>{t('tasks.form.file')}</FormLabel>
                  <FormControl>
                    <Input type='file' {...fileRef} className='h-8 py-0' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button variant='outline'>{t('common.close')}</Button>
          </DialogClose>
          <Button type='submit' form='task-import-form'>
            {t('tasks.importAction')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
