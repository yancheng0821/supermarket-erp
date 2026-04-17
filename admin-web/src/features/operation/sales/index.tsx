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

interface SalesOrder {
  id: number; orderNo: string; channel: string; storeName: string
  totalAmount: number; payAmount: number; status: string; createdAt: string
}
interface PageResult<T> { list: T[]; total: number }

export function SalesOrdersPage() {
  const { t } = useTranslation()

  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: t('operation.sales.pendingPayment'), variant: 'outline' },
    paid: { label: t('operation.sales.paid'), variant: 'default' },
    complete: { label: t('purchase.orders.completed'), variant: 'default' },
    cancelled: { label: t('inventory.receipt.cancelled'), variant: 'destructive' },
    refunded: { label: t('operation.sales.refunded'), variant: 'destructive' },
  }

  const channelLabels: Record<string, string> = {
    POS: t('operation.sales.pos'), online: t('operation.sales.onlineChannel'), O2O: t('operation.sales.o2o'),
  }

  const [data, setData] = useState<SalesOrder[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    let active = true

    const loadData = async () => {
      try {
        const res = await api.get<PageResult<SalesOrder>>('/admin/operation/sales/page', { page, size: 10, keyword })
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
          <h1 className='text-2xl font-bold'>{t('operation.sales.title')}</h1>
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
                <TableHead>{t('operation.sales.channel')}</TableHead>
                <TableHead>{t('purchase.replenish.store')}</TableHead>
                <TableHead>{t('purchase.orders.totalAmount')}</TableHead>
                <TableHead>{t('operation.sales.payAmount')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('common.createdAt')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.orderNo}</TableCell>
                  <TableCell>
                    <Badge variant='outline'>{channelLabels[item.channel] || item.channel}</Badge>
                  </TableCell>
                  <TableCell>{item.storeName}</TableCell>
                  <TableCell>{item.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{item.payAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[item.status]?.variant || 'secondary'}>
                      {statusMap[item.status]?.label || item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.createdAt}</TableCell>
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
    </>
  )
}
