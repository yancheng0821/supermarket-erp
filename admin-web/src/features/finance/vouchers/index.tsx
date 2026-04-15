import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
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

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  posted: { label: 'Posted', variant: 'default' },
  reversed: { label: 'Reversed', variant: 'destructive' },
}

export function VouchersPage() {
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
    } catch (e: any) { toast.error(e.message) }
  }

  useEffect(() => { fetchData() }, [page, keyword])

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/admin/finance/voucher/${editing.id}`, form)
        toast.success('Updated successfully')
      } else {
        await api.post('/admin/finance/voucher', form)
        toast.success('Created successfully')
      }
      setOpen(false); setEditing(null); fetchData()
    } catch (e: any) { toast.error(e.message) }
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
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Vouchers</h1>
          <Button onClick={openCreate}><Plus className='mr-2 h-4 w-4' />New Voucher</Button>
        </div>
        <div className='mb-4 flex items-center gap-2'>
          <Input placeholder='Search voucher no...' value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1) }} className='max-w-sm' />
          <Search className='h-4 w-4 text-muted-foreground' />
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voucher No</TableHead>
                <TableHead>Biz Type</TableHead>
                <TableHead>Debit Account</TableHead>
                <TableHead>Credit Account</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
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
                    <Button variant='outline' size='sm' onClick={() => openEdit(item)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow><TableCell colSpan={8} className='text-center py-8 text-muted-foreground'>No data</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='mt-4 flex items-center justify-between'>
          <span className='text-sm text-muted-foreground'>Total: {total}</span>
          <div className='space-x-2'>
            <Button variant='outline' size='sm' disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</Button>
            <Button variant='outline' size='sm' disabled={page * 10 >= total} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </Main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Voucher' : 'New Voucher'}</DialogTitle></DialogHeader>
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>Biz Type</label>
              <Input value={form.bizType} onChange={(e) => setForm({ ...form, bizType: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>Debit Account</label>
              <Input value={form.debitAccount} onChange={(e) => setForm({ ...form, debitAccount: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>Credit Account</label>
              <Input value={form.creditAccount} onChange={(e) => setForm({ ...form, creditAccount: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>Amount</label>
              <Input type='number' value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
            </div>
            <div>
              <label className='text-sm font-medium'>Period</label>
              <Input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder='2026-04' />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
