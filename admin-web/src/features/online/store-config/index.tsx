import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { LanguageSwitch } from '@/components/language-switch'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Plus, Search } from 'lucide-react'

interface StoreConfig {
  id: number; storeName: string; onlineEnabled: boolean; openTime: string
  closeTime: string; deliveryRadius: number; minOrder: number
}
interface PageResult<T> { list: T[]; total: number }

export function StoreConfigPage() {
  const { t } = useTranslation()
  const [data, setData] = useState<StoreConfig[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<StoreConfig | null>(null)
  const [form, setForm] = useState({ storeName: '', onlineEnabled: true, openTime: '08:00', closeTime: '22:00', deliveryRadius: 3, minOrder: 20 })

  const fetchData = async () => {
    try {
      const res = await api.get<PageResult<StoreConfig>>('/admin/online/store-config/page', { page, size: 10, keyword })
      setData(res.list); setTotal(res.total)
    } catch (e: any) { toast.error(e.message) }
  }

  useEffect(() => { fetchData() }, [page, keyword])

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/admin/online/store-config/${editing.id}`, form)
        toast.success(t('common.operationSuccess'))
      } else {
        await api.post('/admin/online/store-config', form)
        toast.success(t('common.operationSuccess'))
      }
      setOpen(false); setEditing(null); fetchData()
    } catch (e: any) { toast.error(e.message) }
  }

  const openEdit = (item: StoreConfig) => {
    setEditing(item)
    setForm({ storeName: item.storeName, onlineEnabled: item.onlineEnabled, openTime: item.openTime, closeTime: item.closeTime, deliveryRadius: item.deliveryRadius, minOrder: item.minOrder })
    setOpen(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ storeName: '', onlineEnabled: true, openTime: '08:00', closeTime: '22:00', deliveryRadius: 3, minOrder: 20 })
    setOpen(true)
  }

  return (
    <>
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <LanguageSwitch />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>{t('online.storeConfig.title')}</h1>
          <Button onClick={openCreate}><Plus className='mr-2 h-4 w-4' />{t('common.create')}</Button>
        </div>
        <div className='mb-4 flex items-center gap-2'>
          <Input placeholder={t('common.searchByName')} value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1) }} className='max-w-sm' />
          <Search className='h-4 w-4 text-muted-foreground' />
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('purchase.replenish.store')}</TableHead>
                <TableHead>{t('online.storeConfig.onlineEnabled')}</TableHead>
                <TableHead>{t('online.storeConfig.openTime')}</TableHead>
                <TableHead>{t('online.storeConfig.closeTime')}</TableHead>
                <TableHead>{t('online.storeConfig.deliveryRadius')}</TableHead>
                <TableHead>{t('online.storeConfig.minOrderAmount')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.storeName}</TableCell>
                  <TableCell>
                    <Badge variant={item.onlineEnabled ? 'default' : 'secondary'}>
                      {item.onlineEnabled ? t('common.enabled') : t('common.disabled')}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.openTime}</TableCell>
                  <TableCell>{item.closeTime}</TableCell>
                  <TableCell>{item.deliveryRadius} km</TableCell>
                  <TableCell>{item.minOrder.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant='outline' size='sm' onClick={() => openEdit(item)}>{t('common.edit')}</Button>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow><TableCell colSpan={7} className='text-center py-8 text-muted-foreground'>{t('common.noData')}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='mt-4 flex items-center justify-between'>
          <span className='text-sm text-muted-foreground'>{t('common.total')} {total}</span>
          <div className='space-x-2'>
            <Button variant='outline' size='sm' disabled={page <= 1} onClick={() => setPage(page - 1)}>{t('common.previous')}</Button>
            <Button variant='outline' size='sm' disabled={page * 10 >= total} onClick={() => setPage(page + 1)}>{t('common.next')}</Button>
          </div>
        </div>
      </Main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? t('common.edit') : t('common.create')}</DialogTitle></DialogHeader>
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>{t('purchase.replenish.store')}</label>
              <Input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('online.storeConfig.openTime')}</label>
              <Input value={form.openTime} onChange={(e) => setForm({ ...form, openTime: e.target.value })} placeholder='08:00' />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('online.storeConfig.closeTime')}</label>
              <Input value={form.closeTime} onChange={(e) => setForm({ ...form, closeTime: e.target.value })} placeholder='22:00' />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('online.storeConfig.deliveryRadius')}</label>
              <Input type='number' value={form.deliveryRadius} onChange={(e) => setForm({ ...form, deliveryRadius: Number(e.target.value) })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('online.storeConfig.minOrderAmount')}</label>
              <Input type='number' value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleSave}>{t('common.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
