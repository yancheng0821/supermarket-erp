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

interface IssueOrder {
  id: number; orderNo: string; type: string; locationName: string
  supplierName: string; status: string
}
interface PageResult<T> { list: T[]; total: number }

export function IssueOrdersPage() {
  const { t } = useTranslation()

  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    draft: { label: t('purchase.orders.draft'), variant: 'secondary' },
    pending: { label: t('purchase.replenish.pending'), variant: 'outline' },
    confirmed: { label: t('inventory.receipt.confirmed'), variant: 'default' },
    complete: { label: t('purchase.orders.completed'), variant: 'default' },
    cancelled: { label: t('inventory.receipt.cancelled'), variant: 'destructive' },
  }

  const [data, setData] = useState<IssueOrder[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<IssueOrder | null>(null)
  const [form, setForm] = useState({ type: 'sales', locationName: '', supplierName: '' })

  const fetchData = async () => {
    try {
      const res = await api.get<PageResult<IssueOrder>>('/admin/inventory/issue/page', { page, size: 10, keyword })
      setData(res.list); setTotal(res.total)
    } catch (e: any) { toast.error(e.message) }
  }

  useEffect(() => { fetchData() }, [page, keyword])

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/admin/inventory/issue/${editing.id}`, form)
        toast.success(t('common.operationSuccess'))
      } else {
        await api.post('/admin/inventory/issue', form)
        toast.success(t('common.operationSuccess'))
      }
      setOpen(false); setEditing(null); fetchData()
    } catch (e: any) { toast.error(e.message) }
  }

  const handleConfirm = async (id: number) => {
    try {
      await api.put(`/admin/inventory/issue/${id}/confirm`)
      toast.success(t('common.operationSuccess')); fetchData()
    } catch (e: any) { toast.error(e.message) }
  }

  const openEdit = (item: IssueOrder) => {
    setEditing(item)
    setForm({ type: item.type, locationName: item.locationName, supplierName: item.supplierName })
    setOpen(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ type: 'sales', locationName: '', supplierName: '' })
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
          <h1 className='text-2xl font-bold'>{t('inventory.issue.title')}</h1>
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
                <TableHead>{t('inventory.receipt.orderNo')}</TableHead>
                <TableHead>{t('purchase.orders.type')}</TableHead>
                <TableHead>{t('inventory.stock.locationType')}</TableHead>
                <TableHead>{t('purchase.orders.supplier')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
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
                    <Button variant='outline' size='sm' onClick={() => openEdit(item)}>{t('common.edit')}</Button>
                    {(item.status === 'draft' || item.status === 'pending') && (
                      <Button variant='default' size='sm' onClick={() => handleConfirm(item.id)}>
                        <CheckCircle className='mr-1 h-3 w-3' />{t('common.confirm')}
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
                  <SelectItem value='sales'>{t('inventory.issue.salesIssue')}</SelectItem>
                  <SelectItem value='return'>{t('inventory.receipt.returnReceipt')}</SelectItem>
                  <SelectItem value='transfer'>{t('inventory.issue.transferIssue')}</SelectItem>
                  <SelectItem value='damage'>{t('inventory.issue.damageIssue')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='text-sm font-medium'>{t('inventory.stock.locationType')}</label>
              <Input value={form.locationName} onChange={(e) => setForm({ ...form, locationName: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('purchase.orders.supplier')}</label>
              <Input value={form.supplierName} onChange={(e) => setForm({ ...form, supplierName: e.target.value })} />
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
