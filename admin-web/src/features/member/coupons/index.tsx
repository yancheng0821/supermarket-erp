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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Plus, Search } from 'lucide-react'

interface Coupon {
  id: number; name: string; type: string; discountValue: number
  minSpend: number; totalCount: number; usedCount: number; status: string
}
interface PageResult<T> { list: T[]; total: number }

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active: { label: 'Active', variant: 'default' },
  inactive: { label: 'Inactive', variant: 'secondary' },
  expired: { label: 'Expired', variant: 'destructive' },
}

const typeLabels: Record<string, string> = {
  threshold: 'Threshold', percentage: 'Percentage', category: 'Category',
}

export function CouponsPage() {
  const [data, setData] = useState<Coupon[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [form, setForm] = useState({ name: '', type: 'threshold', discountValue: 0, minSpend: 0, totalCount: 0 })

  const fetchData = async () => {
    try {
      const res = await api.get<PageResult<Coupon>>('/admin/member/coupon/page', { page, size: 10, keyword })
      setData(res.list); setTotal(res.total)
    } catch (e: any) { toast.error(e.message) }
  }

  useEffect(() => { fetchData() }, [page, keyword])

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/admin/member/coupon/${editing.id}`, form)
        toast.success('Updated successfully')
      } else {
        await api.post('/admin/member/coupon', form)
        toast.success('Created successfully')
      }
      setOpen(false); setEditing(null); fetchData()
    } catch (e: any) { toast.error(e.message) }
  }

  const openEdit = (item: Coupon) => {
    setEditing(item)
    setForm({ name: item.name, type: item.type, discountValue: item.discountValue, minSpend: item.minSpend, totalCount: item.totalCount })
    setOpen(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', type: 'threshold', discountValue: 0, minSpend: 0, totalCount: 0 })
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
          <h1 className='text-2xl font-bold'>Coupons</h1>
          <Button onClick={openCreate}><Plus className='mr-2 h-4 w-4' />New Coupon</Button>
        </div>
        <div className='mb-4 flex items-center gap-2'>
          <Input placeholder='Search coupon name...' value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1) }} className='max-w-sm' />
          <Search className='h-4 w-4 text-muted-foreground' />
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Discount Value</TableHead>
                <TableHead>Min Spend</TableHead>
                <TableHead>Total Count</TableHead>
                <TableHead>Used Count</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.name}</TableCell>
                  <TableCell><Badge variant='outline'>{typeLabels[item.type] || item.type}</Badge></TableCell>
                  <TableCell>{item.discountValue}</TableCell>
                  <TableCell>{item.minSpend.toFixed(2)}</TableCell>
                  <TableCell>{item.totalCount}</TableCell>
                  <TableCell>{item.usedCount}</TableCell>
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
          <DialogHeader><DialogTitle>{editing ? 'Edit Coupon' : 'New Coupon'}</DialogTitle></DialogHeader>
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>Type</label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='threshold'>Threshold</SelectItem>
                  <SelectItem value='percentage'>Percentage</SelectItem>
                  <SelectItem value='category'>Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='text-sm font-medium'>Discount Value</label>
              <Input type='number' value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} />
            </div>
            <div>
              <label className='text-sm font-medium'>Min Spend</label>
              <Input type='number' value={form.minSpend} onChange={(e) => setForm({ ...form, minSpend: Number(e.target.value) })} />
            </div>
            <div>
              <label className='text-sm font-medium'>Total Count</label>
              <Input type='number' value={form.totalCount} onChange={(e) => setForm({ ...form, totalCount: Number(e.target.value) })} />
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
