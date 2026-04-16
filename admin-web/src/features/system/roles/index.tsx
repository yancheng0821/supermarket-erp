import { useEffect, useState } from 'react'
import { Plus, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LanguageSwitch } from '@/components/language-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/api'
import { hasPermission } from '@/features/auth/permissions'
import { useAuthStore } from '@/stores/auth-store'

interface RoleItem {
  id: number
  name: string
  code: string
  sort: number
  status: number
  remark: string | null
}

interface PageResult<T> {
  list: T[]
  total: number
}

export function SystemRolesPage() {
  const { t } = useTranslation()
  const permissions = useAuthStore((state) => state.permissions)
  const canCreate = hasPermission('system:role:create', permissions)
  const canUpdate = hasPermission('system:role:update', permissions)
  const canToggleStatus = hasPermission('system:role:update-status', permissions)

  const [data, setData] = useState<PageResult<RoleItem>>({ list: [], total: 0 })
  const [loading, setLoading] = useState(false)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize] = useState(10)
  const [searchName, setSearchName] = useState('')
  const [searchCode, setSearchCode] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<RoleItem | null>(null)
  const [form, setForm] = useState({
    name: '',
    code: '',
    sort: '10',
    status: '0',
    remark: '',
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await api.get<PageResult<RoleItem>>('/admin/role/page', {
        pageNo,
        pageSize,
        name: searchName || undefined,
        code: searchCode || undefined,
      })
      setData(result)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('systemRoles.messages.loadError')
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pageNo])

  const handleSearch = () => {
    setPageNo(1)
    fetchData()
  }

  const openCreate = () => {
    setEditingItem(null)
    setForm({
      name: '',
      code: '',
      sort: '10',
      status: '0',
      remark: '',
    })
    setDialogOpen(true)
  }

  const openEdit = (item: RoleItem) => {
    setEditingItem(item)
    setForm({
      name: item.name,
      code: item.code,
      sort: String(item.sort),
      status: String(item.status),
      remark: item.remark || '',
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim(),
        sort: Number(form.sort),
        status: Number(form.status),
        remark: form.remark.trim() || null,
      }

      if (editingItem) {
        await api.put(`/admin/role/${editingItem.id}`, payload)
      } else {
        await api.post('/admin/role', payload)
      }

      toast.success(
        editingItem
          ? t('systemRoles.messages.updated')
          : t('systemRoles.messages.created')
      )
      setDialogOpen(false)
      fetchData()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('systemRoles.messages.saveError')
      )
    }
  }

  const handleToggleStatus = async (item: RoleItem) => {
    const nextStatus = item.status === 0 ? 1 : 0
    try {
      await api.put(`/admin/role/${item.id}/status?status=${nextStatus}`)
      toast.success(t('systemRoles.messages.statusUpdated'))
      fetchData()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('systemRoles.messages.updateError')
      )
    }
  }

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize))

  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <LanguageSwitch />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('systemRoles.title')}
            </h2>
            <p className='text-muted-foreground'>
              {t('systemRoles.description')}
            </p>
          </div>
          {canCreate && (
            <Button onClick={openCreate}>
              <Plus className='mr-2 h-4 w-4' />
              {t('systemRoles.newRole')}
            </Button>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Input
            placeholder={t('systemRoles.searchByName')}
            className='max-w-sm'
            value={searchName}
            onChange={(event) => setSearchName(event.target.value)}
          />
          <Input
            placeholder={t('systemRoles.searchByCode')}
            className='max-w-sm'
            value={searchCode}
            onChange={(event) => setSearchCode(event.target.value)}
          />
          <Button variant='outline' onClick={handleSearch}>
            {t('common.search')}
          </Button>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.name')}</TableHead>
                <TableHead>{t('common.code')}</TableHead>
                <TableHead>{t('systemRoles.sort')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('common.remark')}</TableHead>
                <TableHead className='w-[160px]'>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className='py-8 text-center text-muted-foreground'>
                    {t('systemRoles.loading')}
                  </TableCell>
                </TableRow>
              ) : data.list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='py-8 text-center text-muted-foreground'>
                    {t('systemRoles.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                data.list.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className='font-medium'>{item.name}</TableCell>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.sort}</TableCell>
                    <TableCell>
                      {item.status === 0 ? t('common.enabled') : t('common.disabled')}
                    </TableCell>
                    <TableCell>{item.remark || '-'}</TableCell>
                    <TableCell>
                      <div className='flex gap-2'>
                        {canUpdate && (
                          <Button variant='ghost' size='icon' onClick={() => openEdit(item)}>
                            <Pencil className='h-4 w-4' />
                          </Button>
                        )}
                        {canToggleStatus && (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleToggleStatus(item)}
                          >
                            {item.status === 0
                              ? t('systemRoles.disable')
                              : t('systemRoles.enable')}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className='flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            {t('systemRoles.paginationSummary', {
              total: data.total,
              page: pageNo,
              totalPages,
            })}
          </p>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              disabled={pageNo <= 1}
              onClick={() => setPageNo((value) => value - 1)}
            >
              {t('common.previous')}
            </Button>
            <Button
              variant='outline'
              size='sm'
              disabled={pageNo >= totalPages}
              onClick={() => setPageNo((value) => value + 1)}
            >
              {t('common.next')}
            </Button>
          </div>
        </div>
      </Main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? t('systemRoles.editRole') : t('systemRoles.createRole')}
            </DialogTitle>
            <DialogDescription className='sr-only'>
              {t('systemRoles.dialogDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <Input
              placeholder={t('systemRoles.form.name')}
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
            />
            <Input
              placeholder={t('systemRoles.form.code')}
              value={form.code}
              onChange={(event) =>
                setForm((current) => ({ ...current, code: event.target.value }))
              }
            />
            <div className='grid grid-cols-2 gap-4'>
              <Input
                placeholder={t('systemRoles.form.sort')}
                value={form.sort}
                onChange={(event) =>
                  setForm((current) => ({ ...current, sort: event.target.value }))
                }
              />
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('common.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='0'>{t('common.enabled')}</SelectItem>
                  <SelectItem value='1'>{t('common.disabled')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder={t('systemRoles.form.remark')}
              value={form.remark}
              onChange={(event) =>
                setForm((current) => ({ ...current, remark: event.target.value }))
              }
            />
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSubmit}>
              {editingItem ? t('common.save') : t('common.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
