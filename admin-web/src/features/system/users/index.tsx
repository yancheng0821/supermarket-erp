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

interface UserItem {
  id: number
  username: string
  nickname: string
  phone: string | null
  email: string | null
  avatar: string | null
  status: number
}

interface PageResult<T> {
  list: T[]
  total: number
}

export function SystemUsersPage() {
  const { t } = useTranslation()
  const permissions = useAuthStore((state) => state.permissions)
  const canCreate = hasPermission('system:user:create', permissions)
  const canUpdate = hasPermission('system:user:update', permissions)
  const canToggleStatus = hasPermission('system:user:update-status', permissions)

  const [data, setData] = useState<PageResult<UserItem>>({ list: [], total: 0 })
  const [loading, setLoading] = useState(false)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize] = useState(10)
  const [searchUsername, setSearchUsername] = useState('')
  const [searchNickname, setSearchNickname] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<UserItem | null>(null)
  const [form, setForm] = useState({
    username: '',
    password: '',
    nickname: '',
    phone: '',
    email: '',
    status: '0',
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await api.get<PageResult<UserItem>>('/admin/user/page', {
        pageNo,
        pageSize,
        username: searchUsername || undefined,
        nickname: searchNickname || undefined,
      })
      setData(result)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('systemUsers.messages.loadError')
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
      username: '',
      password: '',
      nickname: '',
      phone: '',
      email: '',
      status: '0',
    })
    setDialogOpen(true)
  }

  const openEdit = (item: UserItem) => {
    setEditingItem(item)
    setForm({
      username: item.username,
      password: '',
      nickname: item.nickname,
      phone: item.phone || '',
      email: item.email || '',
      status: String(item.status),
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        username: form.username.trim(),
        ...(form.password.trim() ? { password: form.password } : {}),
        nickname: form.nickname.trim(),
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        status: Number(form.status),
      }

      if (editingItem) {
        await api.put(`/admin/user/${editingItem.id}`, payload)
      } else {
        await api.post('/admin/user', payload)
      }

      toast.success(
        editingItem
          ? t('systemUsers.messages.updated')
          : t('systemUsers.messages.created')
      )
      setDialogOpen(false)
      fetchData()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('systemUsers.messages.saveError')
      )
    }
  }

  const handleToggleStatus = async (item: UserItem) => {
    const nextStatus = item.status === 0 ? 1 : 0
    try {
      await api.put(`/admin/user/${item.id}/status?status=${nextStatus}`)
      toast.success(t('systemUsers.messages.statusUpdated'))
      fetchData()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('systemUsers.messages.updateError')
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
              {t('systemUsers.title')}
            </h2>
            <p className='text-muted-foreground'>
              {t('systemUsers.description')}
            </p>
          </div>
          {canCreate && (
            <Button onClick={openCreate}>
              <Plus className='mr-2 h-4 w-4' />
              {t('systemUsers.newUser')}
            </Button>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Input
            placeholder={t('systemUsers.searchByUsername')}
            className='max-w-sm'
            value={searchUsername}
            onChange={(event) => setSearchUsername(event.target.value)}
          />
          <Input
            placeholder={t('systemUsers.searchByNickname')}
            className='max-w-sm'
            value={searchNickname}
            onChange={(event) => setSearchNickname(event.target.value)}
          />
          <Button variant='outline' onClick={handleSearch}>
            {t('common.search')}
          </Button>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('users.username')}</TableHead>
                <TableHead>{t('systemUsers.nickname')}</TableHead>
                <TableHead>{t('users.phoneNumber')}</TableHead>
                <TableHead>{t('users.email')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead className='w-[160px]'>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className='py-8 text-center text-muted-foreground'>
                    {t('systemUsers.loading')}
                  </TableCell>
                </TableRow>
              ) : data.list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='py-8 text-center text-muted-foreground'>
                    {t('systemUsers.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                data.list.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className='font-medium'>{item.username}</TableCell>
                    <TableCell>{item.nickname}</TableCell>
                    <TableCell>{item.phone || '-'}</TableCell>
                    <TableCell>{item.email || '-'}</TableCell>
                    <TableCell>
                      {item.status === 0 ? t('common.enabled') : t('common.disabled')}
                    </TableCell>
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
                              ? t('systemUsers.disable')
                              : t('systemUsers.enable')}
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
            {t('systemUsers.paginationSummary', {
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
              {editingItem ? t('systemUsers.editUser') : t('systemUsers.createUser')}
            </DialogTitle>
            <DialogDescription className='sr-only'>
              {t('systemUsers.dialogDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <Input
              placeholder={t('users.username')}
              value={form.username}
              onChange={(event) =>
                setForm((current) => ({ ...current, username: event.target.value }))
              }
            />
            <Input
              placeholder={
                editingItem
                  ? t('systemUsers.passwordOptional')
                  : t('users.password')
              }
              type='password'
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
            />
            <Input
              placeholder={t('systemUsers.nickname')}
              value={form.nickname}
              onChange={(event) =>
                setForm((current) => ({ ...current, nickname: event.target.value }))
              }
            />
            <div className='grid grid-cols-2 gap-4'>
              <Input
                placeholder={t('users.phoneNumber')}
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({ ...current, phone: event.target.value }))
                }
              />
              <Input
                placeholder={t('users.email')}
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
              />
            </div>
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
