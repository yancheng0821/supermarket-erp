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
import { Plus, Search, CheckCircle } from 'lucide-react'

interface ReceiptOrder {
  id: number; orderNo: string; type: string; locationName: string
  supplierName: string; status: string
}
interface PageResult<T> { list: T[]; total: number }

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  pending: { label: 'Pending', variant: 'outline' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  complete: { label: 'Complete', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
}

export function ReceiptOrdersPage() {
  const [data, setData] = useState<ReceiptOrder[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ReceiptOrder | null>(null)
  const [form, setForm] = useState({ type: 'purchase', locationName: '', supplierName: '' })

  const fetchData = async () => {
    try {
      const res = await api.get<PageResult<ReceiptOrder>>('/admin/inventory/receipt/page', { page, size: 10, keyword })
      setData(res.list); setTotal(res.total)
    } catch (e: any) { toast.error(e.message) }
  }

  useEffect(() => { fetchData() }, [page, keyword])

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/admin/inventory/receipt/${editing.id}`, form)
        toast.success('Updated successfully')
      } else {
        await api.post('/admin/inventory/receipt', form)
        toast.success('Created successfully')
      }
      setOpen(false); setEditing(null); fetchData()
    } catch (e: any) { toast.error(e.message) }
  }

  const handleConfirm = async (id: number) => {
    try {
      await api.put(`/admin/inventory/receipt/${id}/confirm`)
      toast.success('Confirmed'); fetchData()
    } catch (e: any) { toast.error(e.message) }
  }

  const openEdit = (item: ReceiptOrder) => {
    setEditing(item)
    setForm({ type: item.type, locationName: item.locationName, supplierName: item.supplierName })
    setOpen(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ type: 'purchase', locationName: '', supplierName: '' })
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
          <h1 className='text-2xl font-bold'>Receipt Orders</h1>
          <Button onClick={openCreate}><Plus className='mr-2 h-4 w-4' />New Receipt</Button>
        </div>
        <div className='mb-4 flex items-center gap-2'>
          <Input placeholder='Search order no...' value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1) }} className='max-w-sm' />
          <Search className='h-4 w-4 text-muted-foreground' />
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order No</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.orderNo}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.locationName}</TableCell>
                  <TableCell>{item.supplierName}</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[item.status]?.variant || 'secondary'}>
                      {statusMap[item.status]?.label || item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='space-x-2'>
                    <Button variant='outline' size='sm' onClick={() => openEdit(item)}>Edit</Button>
                    {(item.status === 'draft' || item.status === 'pending') && (
                      <Button variant='default' size='sm' onClick={() => handleConfirm(item.id)}>
                        <CheckCircle className='mr-1 h-3 w-3' />Confirm
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow><TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>No data</TableCell></TableRow>
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
          <DialogHeader><DialogTitle>{editing ? 'Edit Receipt' : 'New Receipt'}</DialogTitle></DialogHeader>
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>Type</label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='purchase'>Purchase</SelectItem>
                  <SelectItem value='return'>Return</SelectItem>
                  <SelectItem value='transfer'>Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='text-sm font-medium'>Location</label>
              <Input value={form.locationName} onChange={(e) => setForm({ ...form, locationName: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>Supplier</label>
              <Input value={form.supplierName} onChange={(e) => setForm({ ...form, supplierName: e.target.value })} />
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
