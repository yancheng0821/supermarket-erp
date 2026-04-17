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

interface SupplierSettlement {
  id: number; settlementNo: string; supplierName: string; periodStart: string
  periodEnd: string; totalAmount: number; paidAmount: number; status: string
}
interface PageResult<T> { list: T[]; total: number }

export function SupplierSettlementPage() {
  const { t } = useTranslation()

  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    draft: { label: t('purchase.orders.draft'), variant: 'secondary' },
    confirmed: { label: t('inventory.receipt.confirmed'), variant: 'outline' },
    partial_paid: { label: t('finance.supplierSettlement.paidAmount'), variant: 'default' },
    paid: { label: t('finance.supplierSettlement.pay'), variant: 'default' },
    cancelled: { label: t('inventory.receipt.cancelled'), variant: 'destructive' },
  }

  const [data, setData] = useState<SupplierSettlement[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<SupplierSettlement | null>(null)
  const [form, setForm] = useState({ supplierName: '', periodStart: '', periodEnd: '', totalAmount: 0 })

  const fetchData = async () => {
    try {
      const res = await api.get<PageResult<SupplierSettlement>>('/admin/finance/supplier-settlement/page', { page, size: 10, keyword })
      setData(res.list); setTotal(res.total)
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : t('common.operationFailed'))
    }
  }

  useEffect(() => {
    let active = true

    const loadData = async () => {
      try {
        const res = await api.get<PageResult<SupplierSettlement>>('/admin/finance/supplier-settlement/page', { page, size: 10, keyword })
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
        await api.put(`/admin/finance/supplier-settlement/${editing.id}`, form)
        toast.success(t('common.operationSuccess'))
      } else {
        await api.post('/admin/finance/supplier-settlement', form)
        toast.success(t('common.operationSuccess'))
      }
      setOpen(false); setEditing(null); fetchData()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : t('common.operationFailed'))
    }
  }

  const openEdit = (item: SupplierSettlement) => {
    setEditing(item)
    setForm({ supplierName: item.supplierName, periodStart: item.periodStart, periodEnd: item.periodEnd, totalAmount: item.totalAmount })
    setOpen(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ supplierName: '', periodStart: '', periodEnd: '', totalAmount: 0 })
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
          <h1 className='text-2xl font-bold'>{t('finance.supplierSettlement.title')}</h1>
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
                <TableHead>{t('finance.supplierSettlement.settlementNo')}</TableHead>
                <TableHead>{t('purchase.orders.supplier')}</TableHead>
                <TableHead>{t('finance.supplierSettlement.periodStart')}</TableHead>
                <TableHead>{t('finance.supplierSettlement.periodEnd')}</TableHead>
                <TableHead>{t('purchase.orders.totalAmount')}</TableHead>
                <TableHead>{t('finance.supplierSettlement.paidAmount')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.settlementNo}</TableCell>
                  <TableCell>{item.supplierName}</TableCell>
                  <TableCell>{item.periodStart}</TableCell>
                  <TableCell>{item.periodEnd}</TableCell>
                  <TableCell>{item.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{item.paidAmount.toFixed(2)}</TableCell>
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
                <TableRow><TableCell colSpan={8} className='text-center py-8 text-muted-foreground'>{t('common.noData')}</TableCell></TableRow>
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
              <label className='text-sm font-medium'>{t('purchase.orders.supplier')}</label>
              <Input value={form.supplierName} onChange={(e) => setForm({ ...form, supplierName: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('finance.supplierSettlement.periodStart')}</label>
              <Input type='date' value={form.periodStart} onChange={(e) => setForm({ ...form, periodStart: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('finance.supplierSettlement.periodEnd')}</label>
              <Input type='date' value={form.periodEnd} onChange={(e) => setForm({ ...form, periodEnd: e.target.value })} />
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
