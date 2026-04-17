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

interface ReplenishPlan {
  id: number; storeName: string; productName: string; currentStock: number
  minStock: number; suggestQty: number; status: string
}
interface PageResult<T> { list: T[]; total: number }

export function ReplenishPlansPage() {
  const { t } = useTranslation()

  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: t('purchase.replenish.pending'), variant: 'outline' },
    approved: { label: t('purchase.orders.approved'), variant: 'default' },
    ordered: { label: t('purchase.replenish.converted'), variant: 'default' },
    closed: { label: t('purchase.orders.closed'), variant: 'secondary' },
  }

  const [data, setData] = useState<ReplenishPlan[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ReplenishPlan | null>(null)
  const [form, setForm] = useState({ storeName: '', productName: '', currentStock: 0, minStock: 0, suggestQty: 0 })

  const fetchData = async () => {
    try {
      const res = await api.get<PageResult<ReplenishPlan>>('/admin/purchase/replenish/page', { page, size: 10, keyword })
      setData(res.list); setTotal(res.total)
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : t('common.operationFailed'))
    }
  }

  useEffect(() => {
    let active = true

    const loadData = async () => {
      try {
        const res = await api.get<PageResult<ReplenishPlan>>('/admin/purchase/replenish/page', { page, size: 10, keyword })
        if (!active) {
          return
        }

        setData(res.list)
        setTotal(res.total)
      } catch (error: unknown) {
        if (!active) {
          return
        }

        toast.error(error instanceof Error ? error.message : t('common.operationFailed'))
      }
    }

    void loadData()

    return () => {
      active = false
    }
  }, [keyword, page, t])

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/admin/purchase/replenish/${editing.id}`, form)
        toast.success(t('common.operationSuccess'))
      } else {
        await api.post('/admin/purchase/replenish', form)
        toast.success(t('common.operationSuccess'))
      }
      setOpen(false); setEditing(null); fetchData()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : t('common.operationFailed'))
    }
  }

  const openEdit = (item: ReplenishPlan) => {
    setEditing(item)
    setForm({ storeName: item.storeName, productName: item.productName, currentStock: item.currentStock, minStock: item.minStock, suggestQty: item.suggestQty })
    setOpen(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ storeName: '', productName: '', currentStock: 0, minStock: 0, suggestQty: 0 })
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
          <h1 className='text-2xl font-bold'>{t('purchase.replenish.title')}</h1>
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
                <TableHead>{t('purchase.replenish.product')}</TableHead>
                <TableHead>{t('purchase.replenish.currentStock')}</TableHead>
                <TableHead>{t('purchase.replenish.minStock')}</TableHead>
                <TableHead>{t('purchase.replenish.suggestQuantity')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.storeName}</TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.currentStock}</TableCell>
                  <TableCell>{item.minStock}</TableCell>
                  <TableCell>{item.suggestQty}</TableCell>
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
              <label className='text-sm font-medium'>{t('purchase.replenish.product')}</label>
              <Input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('purchase.replenish.minStock')}</label>
              <Input type='number' value={form.minStock} onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('purchase.replenish.suggestQuantity')}</label>
              <Input type='number' value={form.suggestQty} onChange={(e) => setForm({ ...form, suggestQty: Number(e.target.value) })} />
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
