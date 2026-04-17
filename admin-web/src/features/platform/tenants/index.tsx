import { useEffect, useState } from 'react'
import { Plus, Pencil, Search as SearchIcon } from 'lucide-react'
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

interface TenantItem {
  id: number
  code: string
  name: string
  contactName: string | null
  contactPhone: string | null
  status: number
  expireDate: string | null
}

interface PageResult<T> {
  list: T[]
  total: number
}

export function PlatformTenantsPage() {
  const { t } = useTranslation()
  const permissions = useAuthStore((state) => state.permissions)
  const canCreate = hasPermission('platform:tenant:create', permissions)
  const canUpdate = hasPermission('platform:tenant:update', permissions)
  const canToggleStatus = hasPermission(
    'platform:tenant:update-status',
    permissions
  )

  const [data, setData] = useState<PageResult<TenantItem>>({ list: [], total: 0 })
  const [loading, setLoading] = useState(false)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize] = useState(10)
  const [searchCode, setSearchCode] = useState('')
  const [searchName, setSearchName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TenantItem | null>(null)
  const [form, setForm] = useState({
    code: '',
    name: '',
    contactName: '',
    contactPhone: '',
    status: '0',
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await api.get<PageResult<TenantItem>>('/admin/tenant/page', {
        pageNo,
        pageSize,
        code: searchCode || undefined,
        name: searchName || undefined,
      })
      setData(result)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('platformTenants.messages.loadError')
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    const loadData = async () => {
      setLoading(true)
      try {
        const result = await api.get<PageResult<TenantItem>>('/admin/tenant/page', {
          pageNo,
          pageSize,
          code: searchCode || undefined,
          name: searchName || undefined,
        })
        if (!active) {
          return
        }

        setData(result)
      } catch (error) {
        if (!active) {
          return
        }

        toast.error(
          error instanceof Error ? error.message : t('platformTenants.messages.loadError')
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      active = false
    }
  }, [pageNo, pageSize, searchCode, searchName, t])

  const handleSearch = () => {
    setPageNo(1)
    fetchData()
  }

  const openCreate = () => {
    setEditingItem(null)
    setForm({
      code: '',
      name: '',
      contactName: '',
      contactPhone: '',
      status: '0',
    })
    setDialogOpen(true)
  }

  const openEdit = (item: TenantItem) => {
    setEditingItem(item)
    setForm({
      code: item.code,
      name: item.name,
      contactName: item.contactName || '',
      contactPhone: item.contactPhone || '',
      status: String(item.status),
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        code: form.code.trim(),
        name: form.name.trim(),
        contactName: form.contactName.trim() || null,
        contactPhone: form.contactPhone.trim() || null,
        status: Number(form.status),
      }

      if (editingItem) {
        await api.put(`/admin/tenant/${editingItem.id}`, payload)
      } else {
        await api.post('/admin/tenant', payload)
      }

      toast.success(
        editingItem
          ? t('platformTenants.messages.updated')
          : t('platformTenants.messages.created')
      )
      setDialogOpen(false)
      fetchData()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('platformTenants.messages.saveError')
      )
    }
  }

  const handleToggleStatus = async (item: TenantItem) => {
    const nextStatus = item.status === 0 ? 1 : 0
    try {
      await api.put(`/admin/tenant/${item.id}/status?status=${nextStatus}`)
      toast.success(t('platformTenants.messages.statusUpdated'))
      fetchData()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t('platformTenants.messages.updateError')
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
              {t('platformTenants.title')}
            </h2>
            <p className='text-muted-foreground'>
              {t('platformTenants.description')}
            </p>
          </div>
          {canCreate && (
            <Button onClick={openCreate}>
              <Plus className='mr-2 h-4 w-4' />
              {t('platformTenants.newTenant')}
            </Button>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <div className='relative max-w-sm'>
            <SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder={t('platformTenants.searchByCode')}
              className='pl-8'
              value={searchCode}
              onChange={(event) => setSearchCode(event.target.value)}
            />
          </div>
          <Input
            placeholder={t('platformTenants.searchByName')}
            className='max-w-sm'
            value={searchName}
            onChange={(event) => setSearchName(event.target.value)}
          />
          <Button variant='outline' onClick={handleSearch}>
            {t('common.search')}
          </Button>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('platformTenants.tenant')}</TableHead>
                <TableHead>{t('common.code')}</TableHead>
                <TableHead>{t('platformTenants.contact')}</TableHead>
                <TableHead>{t('users.phoneNumber')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('platformTenants.expireDate')}</TableHead>
                <TableHead className='w-[160px]'>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-8 text-center text-muted-foreground'>
                    {t('platformTenants.loading')}
                  </TableCell>
                </TableRow>
              ) : data.list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-8 text-center text-muted-foreground'>
                    {t('platformTenants.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                data.list.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className='font-medium'>{item.name}</TableCell>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.contactName || '-'}</TableCell>
                    <TableCell>{item.contactPhone || '-'}</TableCell>
                    <TableCell>
                      {item.status === 0 ? t('common.enabled') : t('common.disabled')}
                    </TableCell>
                    <TableCell>{item.expireDate || '-'}</TableCell>
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
                              ? t('platformTenants.disable')
                              : t('platformTenants.enable')}
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
            {t('platformTenants.paginationSummary', {
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
              {editingItem
                ? t('platformTenants.editTenant')
                : t('platformTenants.createTenant')}
            </DialogTitle>
            <DialogDescription className='sr-only'>
              {t('platformTenants.dialogDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <Input
              placeholder={t('platformTenants.form.code')}
              value={form.code}
              onChange={(event) =>
                setForm((current) => ({ ...current, code: event.target.value }))
              }
            />
            <Input
              placeholder={t('platformTenants.form.name')}
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
            />
            <Input
              placeholder={t('platformTenants.form.contactName')}
              value={form.contactName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  contactName: event.target.value,
                }))
              }
            />
            <Input
              placeholder={t('platformTenants.form.contactPhone')}
              value={form.contactPhone}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  contactPhone: event.target.value,
                }))
              }
            />
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((current) => ({ ...current, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t('platformTenants.form.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='0'>{t('common.enabled')}</SelectItem>
                <SelectItem value='1'>{t('common.disabled')}</SelectItem>
              </SelectContent>
            </Select>
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
