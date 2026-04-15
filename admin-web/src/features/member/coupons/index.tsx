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

interface Coupon {
  id: number; name: string; type: string; discountValue: number
  minSpend: number; totalCount: number; usedCount: number; status: string
}
interface PageResult<T> { list: T[]; total: number }

export function CouponsPage() {
  const { t } = useTranslation()

  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    active: { label: t('common.active'), variant: 'default' },
    inactive: { label: t('common.disabled'), variant: 'secondary' },
    expired: { label: t('member.points.expire'), variant: 'destructive' },
  }

  const typeLabels: Record<string, string> = {
    threshold: t('member.coupons.thresholdDiscount'), percentage: t('member.coupons.percentageOff'), category: t('member.coupons.categoryCoupon'),
  }

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
        toast.success(t('common.operationSuccess'))
      } else {
        await api.post('/admin/member/coupon', form)
        toast.success(t('common.operationSuccess'))
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
          <LanguageSwitch />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>{t('member.coupons.title')}</h1>
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
                <TableHead>{t('common.name')}</TableHead>
                <TableHead>{t('purchase.orders.type')}</TableHead>
                <TableHead>{t('member.coupons.discountValue')}</TableHead>
                <TableHead>{t('member.coupons.minSpend')}</TableHead>
                <TableHead>{t('member.coupons.totalCount')}</TableHead>
                <TableHead>{t('member.coupons.usedCount')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
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
              <label className='text-sm font-medium'>{t('common.name')}</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('purchase.orders.type')}</label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='threshold'>{t('member.coupons.thresholdDiscount')}</SelectItem>
                  <SelectItem value='percentage'>{t('member.coupons.percentageOff')}</SelectItem>
                  <SelectItem value='category'>{t('member.coupons.categoryCoupon')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='text-sm font-medium'>{t('member.coupons.discountValue')}</label>
              <Input type='number' value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('member.coupons.minSpend')}</label>
              <Input type='number' value={form.minSpend} onChange={(e) => setForm({ ...form, minSpend: Number(e.target.value) })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('member.coupons.totalCount')}</label>
              <Input type='number' value={form.totalCount} onChange={(e) => setForm({ ...form, totalCount: Number(e.target.value) })} />
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
