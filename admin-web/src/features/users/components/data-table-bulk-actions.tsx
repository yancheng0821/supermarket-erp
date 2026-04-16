import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, UserX, UserCheck, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type User } from '../data/schema'
import { UsersMultiDeleteDialog } from './users-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const { t } = useTranslation()

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    toast.promise(sleep(2000), {
      loading:
        status === 'active'
          ? t('users.activatingUsers')
          : t('users.deactivatingUsers'),
      success: () => {
        table.resetRowSelection()
        return status === 'active'
          ? t('users.activateUsersSuccess', { count: selectedUsers.length })
          : t('users.deactivateUsersSuccess', { count: selectedUsers.length })
      },
      error:
        status === 'active'
          ? t('users.activateUsersError')
          : t('users.deactivateUsersError'),
    })
    table.resetRowSelection()
  }

  const handleBulkInvite = () => {
    const selectedUsers = selectedRows.map((row) => row.original as User)
    toast.promise(sleep(2000), {
      loading: t('users.invitingUsers'),
      success: () => {
        table.resetRowSelection()
        return t('users.inviteUsersSuccess', { count: selectedUsers.length })
      },
      error: t('users.inviteUsersError'),
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName={t('users.bulkEntity')}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={handleBulkInvite}
              className='size-8'
              aria-label={t('users.inviteSelectedUsers')}
              title={t('users.inviteSelectedUsers')}
            >
              <Mail />
              <span className='sr-only'>{t('users.inviteSelectedUsers')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('users.inviteSelectedUsers')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label={t('users.activateSelectedUsers')}
              title={t('users.activateSelectedUsers')}
            >
              <UserCheck />
              <span className='sr-only'>
                {t('users.activateSelectedUsers')}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('users.activateSelectedUsers')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label={t('users.deactivateSelectedUsers')}
              title={t('users.deactivateSelectedUsers')}
            >
              <UserX />
              <span className='sr-only'>
                {t('users.deactivateSelectedUsers')}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('users.deactivateSelectedUsers')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label={t('users.deleteSelectedUsers')}
              title={t('users.deleteSelectedUsers')}
            >
              <Trash2 />
              <span className='sr-only'>{t('users.deleteSelectedUsers')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('users.deleteSelectedUsers')}</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <UsersMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
