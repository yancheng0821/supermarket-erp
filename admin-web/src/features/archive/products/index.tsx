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
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Search as SearchIcon } from 'lucide-react'

interface Product {
  id: number
  name: string
  barcode: string
  categoryId: number
  supplierId: number
  spec: string
  unit: string
  shelfLife: number
  status: number
  remark: string
}

interface PageResult<T> {
  list: T[]
  total: number
}

export function ProductsPage() {
  const [data, setData] = useState<PageResult<Product>>({ list: [], total: 0 })
  const [loading, setLoading] = useState(false)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize] = useState(10)
  const [searchName, setSearchName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState({
    name: '', barcode: '', categoryId: '', spec: '', unit: '',
    shelfLife: '', remark: '', costPrice: '', retailPrice: '',
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await api.get<PageResult<Product>>('/admin/archive/product/page', {
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
    setEditingProduct(null)
    setForm({ name: '', barcode: '', categoryId: '', spec: '', unit: '', shelfLife: '', remark: '', costPrice: '', retailPrice: '' })
    setDialogOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setForm({
      name: product.name || '', barcode: product.barcode || '',
      categoryId: String(product.categoryId || ''), spec: product.spec || '',
      unit: product.unit || '', shelfLife: String(product.shelfLife || ''),
      remark: product.remark || '', costPrice: '', retailPrice: '',
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (editingProduct) {
        await api.put('/admin/archive/product', { id: editingProduct.id, ...form })
        toast.success('Product updated')
      } else {
        await api.post('/admin/archive/product', form)
        toast.success('Product created')
      }
      setDialogOpen(false)
      fetchData()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Operation failed')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return
    try {
      await api.del(`/admin/archive/product/${id}`)
      toast.success('Product deleted')
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
            <h2 className='text-2xl font-bold tracking-tight'>Products</h2>
            <p className='text-muted-foreground'>Manage product master data.</p>
          </div>
          <Button onClick={openCreate}><Plus className='mr-2 h-4 w-4' /> New Product</Button>
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
                <TableHead>Barcode</TableHead>
                <TableHead>Spec</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='w-[100px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>Loading...</TableCell></TableRow>
              ) : data.list.length === 0 ? (
                <TableRow><TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>No products found.</TableCell></TableRow>
              ) : (
                data.list.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className='font-medium'>{item.name}</TableCell>
                    <TableCell>{item.barcode}</TableCell>
                    <TableCell>{item.spec}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 0 ? 'default' : 'secondary'}>
                        {item.status === 0 ? 'Active' : 'Discontinued'}
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
            <DialogTitle>{editingProduct ? 'Edit Product' : 'New Product'}</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <Input placeholder='Product name *' value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
            <Input placeholder='Barcode' value={form.barcode} onChange={(e) => setForm({...form, barcode: e.target.value})} />
            <div className='grid grid-cols-2 gap-4'>
              <Input placeholder='Spec (e.g. 500g)' value={form.spec} onChange={(e) => setForm({...form, spec: e.target.value})} />
              <Input placeholder='Unit (kg, piece)' value={form.unit} onChange={(e) => setForm({...form, unit: e.target.value})} />
            </div>
            <Input placeholder='Shelf life (days)' type='number' value={form.shelfLife} onChange={(e) => setForm({...form, shelfLife: e.target.value})} />
            {!editingProduct && (
              <div className='grid grid-cols-2 gap-4'>
                <Input placeholder='Cost price' type='number' value={form.costPrice} onChange={(e) => setForm({...form, costPrice: e.target.value})} />
                <Input placeholder='Retail price' type='number' value={form.retailPrice} onChange={(e) => setForm({...form, retailPrice: e.target.value})} />
              </div>
            )}
            <Input placeholder='Remark' value={form.remark} onChange={(e) => setForm({...form, remark: e.target.value})} />
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingProduct ? 'Save' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
