import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Search as SearchIcon } from 'lucide-react'

interface Supplier {
  id: number
  name: string
  code: string
  contactName: string
  contactPhone: string
  email: string
  address: string
  settlementType: number
  remark: string
  status: number
}

interface PageResult<T> {
  list: T[]
  total: number
}

const SETTLEMENT_TYPES: Record<number, string> = {
  0: 'Monthly', 1: 'Quarterly', 2: 'On Delivery',
}

export function SuppliersPage() {
  const [data, setData] = useState<PageResult<Supplier>>({ list: [], total: 0 })
  const [loading, setLoading] = useState(false)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize] = useState(10)
  const [searchName, setSearchName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Supplier | null>(null)
  const [form, setForm] = useState({
    name: '', code: '', contactName: '', contactPhone: '',
    email: '', address: '', settlementType: '0', remark: '',
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await api.get<PageResult<Supplier>>('/admin/archive/supplier/page', {
        pageNo, pageSize, name: searchName || undefined,
      })
      setData(result)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [pageNo])

  const handleSearch = () => { setPageNo(1); fetchData() }

  const openCreate = () => {
    setEditingItem(null)
    setForm({ name: '', code: '', contactName: '', contactPhone: '', email: '', address: '', settlementType: '0', remark: '' })
    setDialogOpen(true)
  }

  const openEdit = (item: Supplier) => {
    setEditingItem(item)
    setForm({
      name: item.name || '', code: item.code || '',
      contactName: item.contactName || '', contactPhone: item.contactPhone || '',
      email: item.email || '', address: item.address || '',
      settlementType: String(item.settlementType ?? 0), remark: item.remark || '',
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const payload = { ...form, settlementType: Number(form.settlementType) }
      if (editingItem) {
        await api.put('/admin/archive/supplier', { id: editingItem.id, ...payload })
        toast.success('Supplier updated')
      } else {
        await api.post('/admin/archive/supplier', payload)
        toast.success('Supplier created')
      }
      setDialogOpen(false)
      fetchData()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Operation failed')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this supplier?')) return
    try {
      await api.del(`/admin/archive/supplier/${id}`)
      toast.success('Supplier deleted')
      fetchData()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  const totalPages = Math.ceil(data.total / pageSize)

  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Suppliers</h2>
            <p className='text-muted-foreground'>Manage supplier information.</p>
          </div>
          <Button onClick={openCreate}><Plus className='mr-2 h-4 w-4' /> New Supplier</Button>
        </div>

        <div className='flex items-center gap-2'>
          <div className='relative max-w-sm'>
            <SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search by name...'
              className='pl-8'
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button variant='outline' onClick={handleSearch}>Search</Button>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Settlement</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='w-[100px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className='text-center py-8 text-muted-foreground'>Loading...</TableCell></TableRow>
              ) : data.list.length === 0 ? (
                <TableRow><TableCell colSpan={8} className='text-center py-8 text-muted-foreground'>No suppliers found.</TableCell></TableRow>
              ) : (
                data.list.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className='font-medium'>{item.name}</TableCell>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.contactName}</TableCell>
                    <TableCell>{item.contactPhone}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{SETTLEMENT_TYPES[item.settlementType] ?? item.settlementType}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 0 ? 'default' : 'secondary'}>
                        {item.status === 0 ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex gap-1'>
                        <Button variant='ghost' size='icon' onClick={() => openEdit(item)}>
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button variant='ghost' size='icon' onClick={() => handleDelete(item.id)}>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className='flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            Total: {data.total} items | Page {pageNo} of {totalPages || 1}
          </p>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm' disabled={pageNo <= 1} onClick={() => setPageNo(p => p - 1)}>Previous</Button>
            <Button variant='outline' size='sm' disabled={pageNo >= totalPages} onClick={() => setPageNo(p => p + 1)}>Next</Button>
          </div>
        </div>
      </Main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Supplier' : 'New Supplier'}</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <Input placeholder='Supplier name *' value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
            <Input placeholder='Supplier code *' value={form.code} onChange={(e) => setForm({...form, code: e.target.value})} />
            <div className='grid grid-cols-2 gap-4'>
              <Input placeholder='Contact name' value={form.contactName} onChange={(e) => setForm({...form, contactName: e.target.value})} />
              <Input placeholder='Contact phone' value={form.contactPhone} onChange={(e) => setForm({...form, contactPhone: e.target.value})} />
            </div>
            <Input placeholder='Email' value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
            <Input placeholder='Address' value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} />
            <Select value={form.settlementType} onValueChange={(v) => setForm({...form, settlementType: v})}>
              <SelectTrigger><SelectValue placeholder='Settlement type' /></SelectTrigger>
              <SelectContent>
                <SelectItem value='0'>Monthly</SelectItem>
                <SelectItem value='1'>Quarterly</SelectItem>
                <SelectItem value='2'>On Delivery</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder='Remark' value={form.remark} onChange={(e) => setForm({...form, remark: e.target.value})} />
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingItem ? 'Save' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
