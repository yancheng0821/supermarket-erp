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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Plus, Search } from 'lucide-react'

interface OnlineProduct {
  id: number; productId: number; storeName: string; mainImage: string
  sort: number; status: string
}
interface PageResult<T> { list: T[]; total: number }

export function OnlineProductsPage() {
  const { t } = useTranslation()

  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    online: { label: t('common.enabled'), variant: 'default' },
    offline: { label: t('common.disabled'), variant: 'secondary' },
    pending: { label: t('purchase.replenish.pending'), variant: 'outline' },
  }

  const [data, setData] = useState<OnlineProduct[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<OnlineProduct | null>(null)
  const [form, setForm] = useState({ productId: 0, storeName: '', mainImage: '', sort: 0, status: 'online' })

  const fetchData = async () => {
    try {
      const res = await api.get<PageResult<OnlineProduct>>('/admin/online/product/page', { page, size: 10, keyword })
      setData(res.list); setTotal(res.total)
    } catch (e: any) { toast.error(e.message) }
  }

  useEffect(() => { fetchData() }, [page, keyword])

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/admin/online/product/${editing.id}`, form)
        toast.success(t('common.operationSuccess'))
      } else {
        await api.post('/admin/online/product', form)
        toast.success(t('common.operationSuccess'))
      }
      setOpen(false); setEditing(null); fetchData()
    } catch (e: any) { toast.error(e.message) }
  }

  const openEdit = (item: OnlineProduct) => {
    setEditing(item)
    setForm({ productId: item.productId, storeName: item.storeName, mainImage: item.mainImage, sort: item.sort, status: item.status })
    setOpen(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ productId: 0, storeName: '', mainImage: '', sort: 0, status: 'online' })
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
          <h1 className='text-2xl font-bold'>{t('online.products.title')}</h1>
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
                <TableHead>{t('inventory.stock.productId')}</TableHead>
                <TableHead>{t('purchase.replenish.store')}</TableHead>
                <TableHead>{t('online.products.image')}</TableHead>
                <TableHead>{t('archive.categories.sort')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.productId}</TableCell>
                  <TableCell>{item.storeName}</TableCell>
                  <TableCell>
                    {item.mainImage ? (
                      <img
                        src={item.mainImage}
                        alt={t('online.products.productImageAlt')}
                        className='h-10 w-10 rounded object-cover'
                      />
                    ) : '-'}
                  </TableCell>
                  <TableCell>{item.sort}</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[item.status]?.variant || 'secondary'}>
                      {statusMap[item.status]?.label || item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant='outline' size='sm' onClick={() => openEdit(item)}>{t('common.edit')}</Button>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow><TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>{t('common.noData')}</TableCell></TableRow>
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
              <label className='text-sm font-medium'>{t('inventory.stock.productId')}</label>
              <Input type='number' value={form.productId} onChange={(e) => setForm({ ...form, productId: Number(e.target.value) })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('purchase.replenish.store')}</label>
              <Input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>
                {t('online.products.imageUrl')}
              </label>
              <Input value={form.mainImage} onChange={(e) => setForm({ ...form, mainImage: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('archive.categories.sort')}</label>
              <Input type='number' value={form.sort} onChange={(e) => setForm({ ...form, sort: Number(e.target.value) })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('common.status')}</label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='online'>{t('common.enabled')}</SelectItem>
                  <SelectItem value='offline'>{t('common.disabled')}</SelectItem>
                </SelectContent>
              </Select>
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
