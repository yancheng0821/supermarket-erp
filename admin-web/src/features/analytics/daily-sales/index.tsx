import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Search } from 'lucide-react'

interface DailySales {
  id: number; storeName: string; reportDate: string; salesAmount: number
  costAmount: number; profitAmount: number; orderCount: number; customerCount: number
}
interface PageResult<T> { list: T[]; total: number }

export function DailySalesPage() {
  const [data, setData] = useState<DailySales[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')

  const fetchData = async () => {
    try {
      const res = await api.get<PageResult<DailySales>>('/admin/analytics/daily-sales/page', { page, size: 10, keyword })
      setData(res.list); setTotal(res.total)
    } catch (e: any) { toast.error(e.message) }
  }

  useEffect(() => { fetchData() }, [page, keyword])

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
          <h1 className='text-2xl font-bold'>Daily Sales</h1>
        </div>
        <div className='mb-4 flex items-center gap-2'>
          <Input placeholder='Search store...' value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1) }} className='max-w-sm' />
          <Search className='h-4 w-4 text-muted-foreground' />
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store</TableHead>
                <TableHead>Report Date</TableHead>
                <TableHead>Sales Amount</TableHead>
                <TableHead>Cost Amount</TableHead>
                <TableHead>Profit Amount</TableHead>
                <TableHead>Order Count</TableHead>
                <TableHead>Customer Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.storeName}</TableCell>
                  <TableCell>{item.reportDate}</TableCell>
                  <TableCell>{item.salesAmount.toFixed(2)}</TableCell>
                  <TableCell>{item.costAmount.toFixed(2)}</TableCell>
                  <TableCell className={item.profitAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {item.profitAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>{item.orderCount}</TableCell>
                  <TableCell>{item.customerCount}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow><TableCell colSpan={7} className='text-center py-8 text-muted-foreground'>No data</TableCell></TableRow>
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
    </>
  )
}
