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
import { Plus, Search, CheckCircle } from 'lucide-react'

interface PurchaseOrder {
  id: number; orderNo: string; type: string; supplierName: string
  totalAmount: number; status: string
}
interface PageResult<T> { list: T[]; total: number }

export function PurchaseOrdersPage() {
  const { t } = useTranslation()

  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    draft: { label: t('purchase.orders.draft'), variant: 'secondary' },
    pending: { label: t('purchase.orders.pendingReview'), variant: 'outline' },
    approved: { label: t('purchase.orders.approved'), variant: 'default' },
    shipped: { label: t('purchase.orders.shipped'), variant: 'default' },
    partial: { label: t('purchase.orders.partiallyReceived'), variant: 'outline' },
    complete: { label: t('purchase.orders.completed'), variant: 'default' },
    closed: { label: t('purchase.orders.closed'), variant: 'destructive' },
  }

  const typeLabels: Record<string, string> = {
    centralized: t('purchase.orders.centralized'), direct: t('purchase.orders.direct'), self: t('purchase.orders.selfPurchase'),
  }

  const [data, setData] = useState<PurchaseOrder[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<PurchaseOrder | null>(null)
  const [form, setForm] = useState({ type: 'centralized', supplierName: '', totalAmount: 0 })

  const fetchData = async () => {
    try {
      const res = await api.get<PageResult<PurchaseOrder>>('/admin/purchase/order/page', { page, size: 10, keyword })
      setData(res.list); setTotal(res.total)
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : t('common.operationFailed'))
    }
  }

  useEffect(() => {
    let active = true

    const loadData = async () => {
      try {
        const res = await api.get<PageResult<PurchaseOrder>>('/admin/purchase/order/page', { page, size: 10, keyword })
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
        await api.put(`/admin/purchase/order/${editing.id}`, form)
        toast.success(t('common.operationSuccess'))
      } else {
        await api.post('/admin/purchase/order', form)
        toast.success(t('common.operationSuccess'))
      }
      setOpen(false); setEditing(null); fetchData()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : t('common.operationFailed'))
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await api.put(`/admin/purchase/order/${id}/approve`)
      toast.success(t('common.operationSuccess')); fetchData()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : t('common.operationFailed'))
    }
  }

  const openEdit = (item: PurchaseOrder) => {
    setEditing(item)
    setForm({ type: item.type, supplierName: item.supplierName, totalAmount: item.totalAmount })
    setOpen(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ type: 'centralized', supplierName: '', totalAmount: 0 })
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
          <h1 className='text-2xl font-bold'>{t('purchase.orders.title')}</h1>
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
                <TableHead>{t('purchase.orders.orderNo')}</TableHead>
                <TableHead>{t('purchase.orders.type')}</TableHead>
                <TableHead>{t('purchase.orders.supplier')}</TableHead>
                <TableHead>{t('purchase.orders.totalAmount')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.orderNo}</TableCell>
                  <TableCell>{typeLabels[item.type] || item.type}</TableCell>
                  <TableCell>{item.supplierName}</TableCell>
                  <TableCell>{item.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[item.status]?.variant || 'secondary'}>
                      {statusMap[item.status]?.label || item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='space-x-2'>
                    <Button variant='outline' size='sm' onClick={() => openEdit(item)}>{t('common.edit')}</Button>
                    {item.status === 'draft' && (
                      <Button variant='default' size='sm' onClick={() => handleApprove(item.id)}>
                        <CheckCircle className='mr-1 h-3 w-3' />{t('purchase.orders.approve')}
                      </Button>
                    )}
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
              <label className='text-sm font-medium'>{t('purchase.orders.type')}</label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='centralized'>{t('purchase.orders.centralized')}</SelectItem>
                  <SelectItem value='direct'>{t('purchase.orders.direct')}</SelectItem>
                  <SelectItem value='self'>{t('purchase.orders.selfPurchase')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='text-sm font-medium'>{t('purchase.orders.supplier')}</label>
              <Input value={form.supplierName} onChange={(e) => setForm({ ...form, supplierName: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('purchase.orders.totalAmount')}</label>
              <Input type='number' value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: Number(e.target.value) })} />
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
