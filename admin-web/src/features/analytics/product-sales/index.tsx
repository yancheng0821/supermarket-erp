import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { LanguageSwitch } from '@/components/language-switch'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Search } from 'lucide-react'

interface ProductSales {
  id: number; storeName: string; productName: string; reportDate: string
  salesQty: number; salesAmount: number; profitAmount: number
}
interface PageResult<T> { list: T[]; total: number }

export function ProductSalesPage() {
  const { t } = useTranslation()
  const [data, setData] = useState<ProductSales[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    let active = true

    const loadData = async () => {
      try {
        const res = await api.get<PageResult<ProductSales>>('/admin/analytics/product-sales/page', { page, size: 10, keyword })
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
          <h1 className='text-2xl font-bold'>{t('analytics.productSales.title')}</h1>
        </div>
        <div className='mb-4 flex items-center gap-2'>
          <Input placeholder={t('common.searchByName')} value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1) }} className='max-w-sm' />
          <Search className='h-4 w-4 text-muted-foreground' />
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('purchase.replenish.store')}</TableHead>
                <TableHead>{t('purchase.replenish.product')}</TableHead>
                <TableHead>{t('analytics.dailySales.reportDate')}</TableHead>
                <TableHead>{t('analytics.productSales.salesQuantity')}</TableHead>
                <TableHead>{t('analytics.dailySales.salesAmount')}</TableHead>
                <TableHead>{t('analytics.dailySales.profitAmount')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.storeName}</TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.reportDate}</TableCell>
                  <TableCell>{item.salesQty}</TableCell>
                  <TableCell>{item.salesAmount.toFixed(2)}</TableCell>
                  <TableCell className={item.profitAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {item.profitAmount.toFixed(2)}
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
