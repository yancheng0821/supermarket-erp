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
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Search, CheckCircle, XCircle } from 'lucide-react'

interface Refund {
  id: number; refundNo: string; orderId: number; amount: number
  reason: string; status: string
}
interface PageResult<T> { list: T[]; total: number }

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'outline' },
  approved: { label: 'Approved', variant: 'default' },
  complete: { label: 'Complete', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
}

export function RefundsPage() {
  const [data, setData] = useState<Refund[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')

  const fetchData = async () => {
    try {
      const res = await api.get<PageResult<Refund>>('/admin/operation/refund/page', { page, size: 10, keyword })
      setData(res.list); setTotal(res.total)
    } catch (e: any) { toast.error(e.message) }
  }

  useEffect(() => { fetchData() }, [page, keyword])

  const handleAction = async (id: number, action: string) => {
    try {
      await api.put(`/admin/operation/refund/${id}/${action}`)
      toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} successfully`)
      fetchData()
    } catch (e: any) { toast.error(e.message) }
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
          <h1 className='text-2xl font-bold'>Refunds</h1>
        </div>
        <div className='mb-4 flex items-center gap-2'>
          <Input placeholder='Search refund no...' value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1) }} className='max-w-sm' />
          <Search className='h-4 w-4 text-muted-foreground' />
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Refund No</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
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
                          <CheckCircle className='mr-1 h-3 w-3' />Approve
                        </Button>
                        <Button variant='destructive' size='sm' onClick={() => handleAction(item.id, 'reject')}>
                          <XCircle className='mr-1 h-3 w-3' />Reject
                        </Button>
                      </>
                    )}
                    {item.status === 'approved' && (
                      <Button variant='default' size='sm' onClick={() => handleAction(item.id, 'complete')}>
                        <CheckCircle className='mr-1 h-3 w-3' />Complete
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
    </>
  )
}
