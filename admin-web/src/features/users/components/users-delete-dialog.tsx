'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { getUserRoleLabel } from '../data/data'
import { type User } from '../data/schema'

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const [value, setValue] = useState('')
  const { t } = useTranslation()

  const handleDelete = () => {
    if (value.trim() !== currentRow.username) return

    onOpenChange(false)
    showSubmittedData(currentRow, t('users.deletedSummary'))
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form='users-delete-form'
      disabled={value.trim() !== currentRow.username}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          {t('users.deleteUser')}
        </span>
      }
      desc={
        <form
          id='users-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className='space-y-4'
        >
          <p className='mb-2'>
            {t('users.deleteDescription', {
              username: currentRow.username,
              role: getUserRoleLabel(t, currentRow.role),
            })}
          </p>

          <Label className='my-2'>
            {t('users.deleteUsernamePrompt')}
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t('users.deleteUsernamePlaceholder')}
              autoFocus
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>{t('users.warning')}</AlertTitle>
            <AlertDescription>{t('users.warningDescription')}</AlertDescription>
          </Alert>
        </form>
      }
      confirmText={t('common.delete')}
      destructive
    />
  )
}
