import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, CircleArrowUp, ArrowUpDown, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { getTaskPriorities, getTaskStatuses } from '../data/data'
import { type Task } from '../data/schema'
import { TasksMultiDeleteDialog } from './tasks-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const { t } = useTranslation()
  const statuses = getTaskStatuses(t)
  const priorities = getTaskPriorities(t)

  const handleBulkStatusChange = (status: string) => {
    const selectedTasks = selectedRows.map((row) => row.original as Task)
    const statusLabel =
      statuses.find((item) => item.value === status)?.label ?? status

    toast.promise(sleep(2000), {
      loading: t('tasks.messages.updatingStatus'),
      success: () => {
        table.resetRowSelection()
        return t('tasks.messages.statusUpdated', {
          count: selectedTasks.length,
          status: statusLabel,
        })
      },
      error: t('tasks.messages.error'),
    })
    table.resetRowSelection()
  }

  const handleBulkPriorityChange = (priority: string) => {
    const selectedTasks = selectedRows.map((row) => row.original as Task)
    const priorityLabel =
      priorities.find((item) => item.value === priority)?.label ?? priority

    toast.promise(sleep(2000), {
      loading: t('tasks.messages.updatingPriority'),
      success: () => {
        table.resetRowSelection()
        return t('tasks.messages.priorityUpdated', {
          count: selectedTasks.length,
          priority: priorityLabel,
        })
      },
      error: t('tasks.messages.error'),
    })
    table.resetRowSelection()
  }

  const handleBulkExport = () => {
    const selectedTasks = selectedRows.map((row) => row.original as Task)
    toast.promise(sleep(2000), {
      loading: t('tasks.messages.exporting'),
      success: () => {
        table.resetRowSelection()
        return t('tasks.messages.exported', {
          count: selectedTasks.length,
        })
      },
      error: t('tasks.messages.error'),
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName={t('tasks.bulkEntity')}>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='size-8'
                  aria-label={t('tasks.bulkActions.updateStatus')}
                  title={t('tasks.bulkActions.updateStatus')}
                >
                  <CircleArrowUp />
                  <span className='sr-only'>
                    {t('tasks.bulkActions.updateStatus')}
                  </span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('tasks.bulkActions.updateStatus')}</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent sideOffset={14}>
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status.value}
                defaultValue={status.value}
                onClick={() => handleBulkStatusChange(status.value)}
              >
                {status.icon && (
                  <status.icon className='size-4 text-muted-foreground' />
                )}
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='size-8'
                  aria-label={t('tasks.bulkActions.updatePriority')}
                  title={t('tasks.bulkActions.updatePriority')}
                >
                  <ArrowUpDown />
                  <span className='sr-only'>
                    {t('tasks.bulkActions.updatePriority')}
                  </span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('tasks.bulkActions.updatePriority')}</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent sideOffset={14}>
            {priorities.map((priority) => (
              <DropdownMenuItem
                key={priority.value}
                defaultValue={priority.value}
                onClick={() => handleBulkPriorityChange(priority.value)}
              >
                {priority.icon && (
                  <priority.icon className='size-4 text-muted-foreground' />
                )}
                {priority.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkExport()}
              className='size-8'
              aria-label={t('tasks.bulkActions.exportTasks')}
              title={t('tasks.bulkActions.exportTasks')}
            >
              <Download />
              <span className='sr-only'>{t('tasks.bulkActions.exportTasks')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('tasks.bulkActions.exportTasks')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label={t('tasks.bulkActions.deleteSelectedTasks')}
              title={t('tasks.bulkActions.deleteSelectedTasks')}
            >
              <Trash2 />
              <span className='sr-only'>
                {t('tasks.bulkActions.deleteSelectedTasks')}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('tasks.bulkActions.deleteSelectedTasks')}</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <TasksMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
