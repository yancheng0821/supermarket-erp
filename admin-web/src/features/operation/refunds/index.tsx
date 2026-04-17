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
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Search, CheckCircle, XCircle } from 'lucide-react'

interface Refund {
  id: number; refundNo: string; orderId: number; amount: number
  reason: string; status: string
}
interface PageResult<T> { list: T[]; total: number }

export function RefundsPage() {
  const { t } = useTranslation()

  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: t('purchase.replenish.pending'), variant: 'outline' },
    approved: { label: t('purchase.orders.approved'), variant: 'default' },
    complete: { label: t('operation.refunds.complete'), variant: 'default' },
    rejected: { label: t('operation.refunds.reject'), variant: 'destructive' },
  }

  const [data, setData] = useState<Refund[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')

  const fetchData = async () => {
    try {
      const res = await api.get<PageResult<Refund>>('/admin/operation/refund/page', { page, size: 10, keyword })
      setData(res.list); setTotal(res.total)
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : t('common.operationFailed'))
    }
  }

  useEffect(() => {
    let active = true

    const loadData = async () => {
      try {
        const res = await api.get<PageResult<Refund>>('/admin/operation/refund/page', { page, size: 10, keyword })
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

  const handleAction = async (id: number, action: string) => {
    try {
      await api.put(`/admin/operation/refund/${id}/${action}`)
      toast.success(t('common.operationSuccess'))
      fetchData()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : t('common.operationFailed'))
    }
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
          <h1 className='text-2xl font-bold'>{t('operation.refunds.title')}</h1>
        </div>
        <div className='mb-4 flex items-center gap-2'>
          <Input placeholder={t('common.searchByName')} value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1) }} className='max-w-sm' />
          <Search className='h-4 w-4 text-muted-foreground' />
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('operation.refunds.refundNo')}</TableHead>
                <TableHead>{t('operation.refunds.orderId')}</TableHead>
                <TableHead>{t('operation.refunds.refundAmount')}</TableHead>
                <TableHead>{t('operation.refunds.reason')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.refundNo}</TableCell>
                  <TableCell>{item.orderId}</TableCell>
                  <TableCell>{item.amount.toFixed(2)}</TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[item.status]?.variant || 'secondary'}>
                      {statusMap[item.status]?.label || item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='space-x-2'>
                    {item.status === 'pending' && (
                      <>
                        <Button variant='default' size='sm' onClick={() => handleAction(item.id, 'approve')}>
                          <CheckCircle className='mr-1 h-3 w-3' />{t('purchase.orders.approve')}
                        </Button>
                        <Button variant='destructive' size='sm' onClick={() => handleAction(item.id, 'reject')}>
                          <XCircle className='mr-1 h-3 w-3' />{t('operation.refunds.reject')}
                        </Button>
                      </>
                    )}
                    {item.status === 'approved' && (
                      <Button variant='default' size='sm' onClick={() => handleAction(item.id, 'complete')}>
                        <CheckCircle className='mr-1 h-3 w-3' />{t('operation.refunds.complete')}
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
    </>
  )
}
