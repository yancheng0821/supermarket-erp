'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

type TaskMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function TasksMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: TaskMultiDeleteDialogProps<TData>) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const confirmWord = t('tasks.multiDelete.confirmWord')

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    if (value.trim() !== confirmWord) {
      toast.error(t('tasks.multiDelete.confirmError', { word: confirmWord }))
      return
    }

    onOpenChange(false)

    toast.promise(sleep(2000), {
      loading: t('tasks.multiDelete.loading'),
      success: () => {
        setValue('')
        table.resetRowSelection()
        return t('tasks.multiDelete.success', { count: selectedRows.length })
      },
      error: t('tasks.messages.error'),
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form='tasks-multi-delete-form'
      disabled={value.trim() !== confirmWord}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('tasks.multiDelete.title', { count: selectedRows.length })}
        </span>
      }
      desc={
        <form
          id='tasks-multi-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('tasks.multiDelete.description')} <br />
            {t('tasks.multiDelete.irreversible')}
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span>
              {t('tasks.multiDelete.confirmPrompt', { word: confirmWord })}
            </span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('tasks.multiDelete.confirmPlaceholder', {
                word: confirmWord,
              })}
              autoFocus
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>{t('tasks.multiDelete.warningTitle')}</AlertTitle>
            <AlertDescription>
              {t('tasks.multiDelete.warningDescription')}
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('common.delete')}
      destructive
    />
  )
}
