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

interface MenuItem {
  id: number
  scope: string
  name: string
  permission: string | null
  type: number
  parentId: number
  path: string | null
  component: string | null
  icon: string | null
  sort: number
  status: number
  children: MenuItem[]
}

interface MenuRow extends MenuItem {
  depth: number
}

function flattenMenus(items: MenuItem[], depth = 0): MenuRow[] {
  return items.flatMap((item) => [
    { ...item, depth },
    ...flattenMenus(item.children, depth + 1),
  ])
}

export function PlatformMenusPage() {
  const { t } = useTranslation()
  const permissions = useAuthStore((state) => state.permissions)
  const canCreate = hasPermission('platform:menu:create', permissions)
  const canUpdate = hasPermission('platform:menu:update', permissions)

  const [menus, setMenus] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [form, setForm] = useState({
    name: '',
    permission: '',
    type: '2',
    parentId: '0',
    path: '',
    component: '',
    icon: 'settings',
    sort: '10',
    status: '0',
  })

  const fetchMenus = async () => {
    setLoading(true)
    try {
      const result = await api.get<MenuItem[]>('/admin/menu/tree', {
        scope: 'platform',
      })
      setMenus(result)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('platformMenus.messages.loadError')
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMenus()
  }, [])

  const rows = flattenMenus(menus)

  const openCreate = () => {
    setEditingItem(null)
    setForm({
      name: '',
      permission: '',
      type: '2',
      parentId: '0',
      path: '',
      component: '',
      icon: 'settings',
      sort: '10',
      status: '0',
    })
    setDialogOpen(true)
  }

  const openEdit = (item: MenuItem) => {
    setEditingItem(item)
    setForm({
      name: item.name,
      permission: item.permission || '',
      type: String(item.type),
      parentId: String(item.parentId),
      path: item.path || '',
      component: item.component || '',
      icon: item.icon || 'settings',
      sort: String(item.sort),
      status: String(item.status),
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        scope: 'platform',
        name: form.name.trim(),
        permission: form.permission.trim() || null,
        type: Number(form.type),
        parentId: Number(form.parentId),
        path: form.path.trim() || null,
        component: form.component.trim() || null,
        icon: form.icon.trim() || null,
        sort: Number(form.sort),
        status: Number(form.status),
      }

      if (editingItem) {
        await api.put(`/admin/menu/${editingItem.id}`, payload)
      } else {
        await api.post('/admin/menu', payload)
      }

      toast.success(
        editingItem
          ? t('platformMenus.messages.updated')
          : t('platformMenus.messages.created')
      )
      setDialogOpen(false)
      fetchMenus()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('platformMenus.messages.saveError')
      )
    }
  }

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
              {t('platformMenus.title')}
            </h2>
            <p className='text-muted-foreground'>
              {t('platformMenus.description')}
            </p>
          </div>
          {canCreate && (
            <Button onClick={openCreate}>
              <Plus className='mr-2 h-4 w-4' />
              {t('platformMenus.newMenu')}
            </Button>
          )}
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.name')}</TableHead>
                <TableHead>{t('platformMenus.permission')}</TableHead>
                <TableHead>{t('platformMenus.type')}</TableHead>
                <TableHead>{t('platformMenus.path')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead className='w-[100px]'>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className='py-8 text-center text-muted-foreground'>
                    {t('platformMenus.loading')}
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='py-8 text-center text-muted-foreground'>
                    {t('platformMenus.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className='font-medium'>
                      <span style={{ paddingLeft: `${item.depth * 16}px` }}>
                        {item.name}
                      </span>
                    </TableCell>
                    <TableCell>{item.permission || '-'}</TableCell>
                    <TableCell>
                      {item.type === 1
                        ? t('platformMenus.types.directory')
                        : item.type === 2
                          ? t('platformMenus.types.menu')
                          : t('platformMenus.types.button')}
                    </TableCell>
                    <TableCell>{item.path || '-'}</TableCell>
                    <TableCell>
                      {item.status === 0 ? t('common.enabled') : t('common.disabled')}
                    </TableCell>
                    <TableCell>
                      {canUpdate && (
                        <Button variant='ghost' size='icon' onClick={() => openEdit(item)}>
                          <Pencil className='h-4 w-4' />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem
                ? t('platformMenus.editMenu')
                : t('platformMenus.createMenu')}
            </DialogTitle>
            <DialogDescription className='sr-only'>
              {t('platformMenus.dialogDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <Input
              placeholder={t('platformMenus.form.name')}
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
            />
            <Input
              placeholder={t('platformMenus.form.permission')}
              value={form.permission}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  permission: event.target.value,
                }))
              }
            />
            <div className='grid grid-cols-2 gap-4'>
              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('platformMenus.form.type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='1'>
                    {t('platformMenus.types.directory')}
                  </SelectItem>
                  <SelectItem value='2'>{t('platformMenus.types.menu')}</SelectItem>
                  <SelectItem value='3'>
                    {t('platformMenus.types.button')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={form.parentId}
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, parentId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('platformMenus.form.parentMenu')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='0'>{t('platformMenus.root')}</SelectItem>
                  {rows.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {'-'.repeat(item.depth + 1)} {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder={t('platformMenus.form.routePath')}
              value={form.path}
              onChange={(event) =>
                setForm((current) => ({ ...current, path: event.target.value }))
              }
            />
            <Input
              placeholder={t('platformMenus.form.component')}
              value={form.component}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  component: event.target.value,
                }))
              }
            />
            <div className='grid grid-cols-3 gap-4'>
              <Input
                placeholder={t('platformMenus.form.icon')}
                value={form.icon}
                onChange={(event) =>
                  setForm((current) => ({ ...current, icon: event.target.value }))
                }
              />
              <Input
                placeholder={t('platformMenus.form.sort')}
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
