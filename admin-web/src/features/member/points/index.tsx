import { useState } from 'react'
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

interface PointsLog {
  id: number; memberId: number; type: string; points: number
  balance: number; remark: string; createdAt: string
}
interface PageResult<T> { list: T[]; total: number }

export function PointsLogPage() {
  const { t } = useTranslation()
  const [data, setData] = useState<PointsLog[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [memberId, setMemberId] = useState('')

  const fetchData = async () => {
    if (!memberId) { toast.error(t('member.points.memberId')); return }
    try {
      const res = await api.get<PageResult<PointsLog>>('/admin/member/points/log', { page, size: 10, memberId })
      setData(res.list); setTotal(res.total)
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
          <h1 className='text-2xl font-bold'>{t('member.points.title')}</h1>
        </div>
        <div className='mb-4 flex items-center gap-2'>
          <Input placeholder={t('member.points.memberId')} value={memberId} onChange={(e) => setMemberId(e.target.value)} className='max-w-xs' />
          <Button onClick={() => { setPage(1); fetchData() }}>
            <Search className='mr-2 h-4 w-4' />{t('common.search')}
          </Button>
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('member.points.memberId')}</TableHead>
                <TableHead>{t('purchase.orders.type')}</TableHead>
                <TableHead>{t('member.points.title')}</TableHead>
                <TableHead>{t('member.points.pointsAfter')}</TableHead>
                <TableHead>{t('common.remark')}</TableHead>
                <TableHead>{t('common.createdAt')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.memberId}</TableCell>
                  <TableCell>
                    <Badge variant={item.points > 0 ? 'default' : 'destructive'}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={item.points > 0 ? 'text-green-600' : 'text-red-600'}>
                    {item.points > 0 ? `+${item.points}` : item.points}
                  </TableCell>
                  <TableCell>{item.balance}</TableCell>
                  <TableCell>{item.remark}</TableCell>
                  <TableCell>{item.createdAt}</TableCell>
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
            <Button variant='outline' size='sm' disabled={page <= 1} onClick={() => { setPage(page - 1); fetchData() }}>{t('common.previous')}</Button>
            <Button variant='outline' size='sm' disabled={page * 10 >= total} onClick={() => { setPage(page + 1); fetchData() }}>{t('common.next')}</Button>
          </div>
        </div>
      </Main>
    </>
  )
}
