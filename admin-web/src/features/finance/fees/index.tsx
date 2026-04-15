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

interface FeeRecord {
  id: number; feeNo: string; type: string; targetType: string
  targetId: number; amount: number; status: string
}
interface PageResult<T> { list: T[]; total: number }

export function FeeRecordsPage() {
  const { t } = useTranslation()

  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: t('purchase.replenish.pending'), variant: 'outline' },
    confirmed: { label: t('inventory.receipt.confirmed'), variant: 'default' },
    paid: { label: t('finance.supplierSettlement.pay'), variant: 'default' },
    cancelled: { label: t('inventory.receipt.cancelled'), variant: 'destructive' },
  }
  const typeMap: Record<string, string> = {
    delivery: t('online.deliveries.delivery'),
    platform: t('finance.fees.platform'),
    service: t('finance.fees.service'),
    other: t('finance.fees.other'),
  }
  const targetTypeMap: Record<string, string> = {
    store: t('purchase.replenish.store'),
    supplier: t('purchase.orders.supplier'),
  }

  const [data, setData] = useState<FeeRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<FeeRecord | null>(null)
  const [form, setForm] = useState({ type: 'delivery', targetType: 'store', targetId: 0, amount: 0 })

  const fetchData = async () => {
    try {
      const res = await api.get<PageResult<FeeRecord>>('/admin/finance/fee/page', { page, size: 10, keyword })
      setData(res.list); setTotal(res.total)
    } catch (e: any) { toast.error(e.message) }
  }

  useEffect(() => { fetchData() }, [page, keyword])

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/admin/finance/fee/${editing.id}`, form)
        toast.success(t('common.operationSuccess'))
      } else {
        await api.post('/admin/finance/fee', form)
        toast.success(t('common.operationSuccess'))
      }
      setOpen(false); setEditing(null); fetchData()
    } catch (e: any) { toast.error(e.message) }
  }

  const openEdit = (item: FeeRecord) => {
    setEditing(item)
    setForm({ type: item.type, targetType: item.targetType, targetId: item.targetId, amount: item.amount })
    setOpen(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ type: 'delivery', targetType: 'store', targetId: 0, amount: 0 })
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
          <h1 className='text-2xl font-bold'>{t('finance.fees.title')}</h1>
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
                <TableHead>{t('finance.fees.feeNo')}</TableHead>
                <TableHead>{t('purchase.orders.type')}</TableHead>
                <TableHead>{t('finance.fees.targetType')}</TableHead>
                <TableHead>{t('finance.fees.targetId')}</TableHead>
                <TableHead>{t('operation.payments.amount')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.feeNo}</TableCell>
                  <TableCell>{typeMap[item.type] || item.type}</TableCell>
                  <TableCell>
                    {targetTypeMap[item.targetType] || item.targetType}
                  </TableCell>
                  <TableCell>{item.targetId}</TableCell>
                  <TableCell>{item.amount.toFixed(2)}</TableCell>
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
              <label className='text-sm font-medium'>{t('purchase.orders.type')}</label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='delivery'>{t('online.deliveries.delivery')}</SelectItem>
                  <SelectItem value='platform'>{t('finance.fees.platform')}</SelectItem>
                  <SelectItem value='service'>{t('finance.fees.service')}</SelectItem>
                  <SelectItem value='other'>{t('finance.fees.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='text-sm font-medium'>
                {t('finance.fees.targetType')}
              </label>
              <Select value={form.targetType} onValueChange={(v) => setForm({ ...form, targetType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='store'>{t('purchase.replenish.store')}</SelectItem>
                  <SelectItem value='supplier'>{t('purchase.orders.supplier')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='text-sm font-medium'>
                {t('finance.fees.targetId')}
              </label>
              <Input type='number' value={form.targetId} onChange={(e) => setForm({ ...form, targetId: Number(e.target.value) })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('operation.payments.amount')}</label>
              <Input type='number' value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
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
