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

interface Voucher {
  id: number; voucherNo: string; bizType: string; debitAccount: string
  creditAccount: string; amount: number; period: string; status: string
}
interface PageResult<T> { list: T[]; total: number }

export function VouchersPage() {
  const { t } = useTranslation()

  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    draft: { label: t('purchase.orders.draft'), variant: 'secondary' },
    posted: { label: t('finance.vouchers.posted'), variant: 'default' },
    reversed: { label: t('inventory.receipt.cancelled'), variant: 'destructive' },
  }

  const [data, setData] = useState<Voucher[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Voucher | null>(null)
  const [form, setForm] = useState({ bizType: '', debitAccount: '', creditAccount: '', amount: 0, period: '' })

  const fetchData = async () => {
    try {
      const res = await api.get<PageResult<Voucher>>('/admin/finance/voucher/page', { page, size: 10, keyword })
      setData(res.list); setTotal(res.total)
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : t('common.operationFailed'))
    }
  }

  useEffect(() => {
    let active = true

    const loadData = async () => {
      try {
        const res = await api.get<PageResult<Voucher>>('/admin/finance/voucher/page', { page, size: 10, keyword })
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
        await api.put(`/admin/finance/voucher/${editing.id}`, form)
        toast.success(t('common.operationSuccess'))
      } else {
        await api.post('/admin/finance/voucher', form)
        toast.success(t('common.operationSuccess'))
      }
      setOpen(false); setEditing(null); fetchData()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : t('common.operationFailed'))
    }
  }

  const openEdit = (item: Voucher) => {
    setEditing(item)
    setForm({ bizType: item.bizType, debitAccount: item.debitAccount, creditAccount: item.creditAccount, amount: item.amount, period: item.period })
    setOpen(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ bizType: '', debitAccount: '', creditAccount: '', amount: 0, period: '' })
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
          <h1 className='text-2xl font-bold'>{t('finance.vouchers.title')}</h1>
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
                <TableHead>{t('finance.vouchers.voucherNo')}</TableHead>
                <TableHead>{t('finance.vouchers.bizType')}</TableHead>
                <TableHead>{t('finance.vouchers.debitAccount')}</TableHead>
                <TableHead>{t('finance.vouchers.creditAccount')}</TableHead>
                <TableHead>{t('operation.payments.amount')}</TableHead>
                <TableHead>{t('finance.vouchers.period')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.voucherNo}</TableCell>
                  <TableCell>{item.bizType}</TableCell>
                  <TableCell>{item.debitAccount}</TableCell>
                  <TableCell>{item.creditAccount}</TableCell>
                  <TableCell>{item.amount.toFixed(2)}</TableCell>
                  <TableCell>{item.period}</TableCell>
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
              <label className='text-sm font-medium'>{t('finance.vouchers.bizType')}</label>
              <Input value={form.bizType} onChange={(e) => setForm({ ...form, bizType: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('finance.vouchers.debitAccount')}</label>
              <Input value={form.debitAccount} onChange={(e) => setForm({ ...form, debitAccount: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('finance.vouchers.creditAccount')}</label>
              <Input value={form.creditAccount} onChange={(e) => setForm({ ...form, creditAccount: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('operation.payments.amount')}</label>
              <Input type='number' value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('finance.vouchers.period')}</label>
              <Input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder='2026-04' />
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
