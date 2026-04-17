import { useEffect, useState } from 'react'
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
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Search } from 'lucide-react'

interface DeliveryOrder {
  id: number; orderNo: string; storeName: string; deliveryType: string
  contact: string; address: string; status: string
}
interface PageResult<T> { list: T[]; total: number }

export function DeliveryOrdersPage() {
  const { t } = useTranslation()

  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: t('purchase.replenish.pending'), variant: 'outline' },
    assigned: { label: t('common.active'), variant: 'default' },
    picked: { label: t('common.active'), variant: 'default' },
    delivering: { label: t('operation.sales.delivering'), variant: 'default' },
    delivered: { label: t('purchase.orders.completed'), variant: 'default' },
    cancelled: { label: t('inventory.receipt.cancelled'), variant: 'destructive' },
  }

  const [data, setData] = useState<DeliveryOrder[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    let active = true

    const loadData = async () => {
      try {
        const res = await api.get<PageResult<DeliveryOrder>>('/admin/online/delivery/page', { page, size: 10, keyword })
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
          <h1 className='text-2xl font-bold'>{t('online.deliveries.title')}</h1>
        </div>
        <div className='mb-4 flex items-center gap-2'>
          <Input placeholder={t('common.searchByName')} value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1) }} className='max-w-sm' />
          <Search className='h-4 w-4 text-muted-foreground' />
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('purchase.orders.orderNo')}</TableHead>
                <TableHead>{t('purchase.replenish.store')}</TableHead>
                <TableHead>{t('purchase.orders.type')}</TableHead>
                <TableHead>{t('archive.stores.contactName')}</TableHead>
                <TableHead>{t('archive.stores.address')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.orderNo}</TableCell>
                  <TableCell>{item.storeName}</TableCell>
                  <TableCell><Badge variant='outline'>{item.deliveryType}</Badge></TableCell>
                  <TableCell>{item.contact}</TableCell>
                  <TableCell className='max-w-[200px] truncate'>{item.address}</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[item.status]?.variant || 'secondary'}>
                      {statusMap[item.status]?.label || item.status}
                    </Badge>
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
    </>
  )
}
