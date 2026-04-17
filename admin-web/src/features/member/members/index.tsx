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
import { UserPlus, Search } from 'lucide-react'

interface Member {
  id: number; phone: string; name: string; nickname: string
  level: string; status: string
}
interface PageResult<T> { list: T[]; total: number }

export function MembersPage() {
  const { t } = useTranslation()

  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    active: { label: t('common.active'), variant: 'default' },
    inactive: { label: t('common.disabled'), variant: 'secondary' },
    blocked: { label: t('common.disabled'), variant: 'destructive' },
  }

  const [data, setData] = useState<Member[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [form, setForm] = useState({ phone: '', name: '', nickname: '', level: 'normal' })

  const fetchData = async () => {
    try {
      const res = await api.get<PageResult<Member>>('/admin/member/member/page', { page, size: 10, keyword })
      setData(res.list); setTotal(res.total)
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : t('common.operationFailed'))
    }
  }

  useEffect(() => {
    let active = true

    const loadData = async () => {
      try {
        const res = await api.get<PageResult<Member>>('/admin/member/member/page', { page, size: 10, keyword })
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

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/admin/member/member/${editing.id}`, form)
        toast.success(t('common.operationSuccess'))
      } else {
        await api.post('/admin/member/member', form)
        toast.success(t('common.operationSuccess'))
      }
      setOpen(false); setEditing(null); fetchData()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : t('common.operationFailed'))
    }
  }

  const openEdit = (item: Member) => {
    setEditing(item)
    setForm({ phone: item.phone, name: item.name, nickname: item.nickname, level: item.level })
    setOpen(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ phone: '', name: '', nickname: '', level: 'normal' })
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
          <h1 className='text-2xl font-bold'>{t('member.members.title')}</h1>
          <Button onClick={openCreate}><UserPlus className='mr-2 h-4 w-4' />{t('member.members.register')}</Button>
        </div>
        <div className='mb-4 flex items-center gap-2'>
          <Input placeholder={t('common.searchByName')} value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1) }} className='max-w-sm' />
          <Search className='h-4 w-4 text-muted-foreground' />
        </div>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('member.members.phone')}</TableHead>
                <TableHead>{t('common.name')}</TableHead>
                <TableHead>{t('member.members.nickname')}</TableHead>
                <TableHead>{t('member.members.level')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>{item.phone}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.nickname}</TableCell>
                  <TableCell><Badge variant='outline'>{item.level}</Badge></TableCell>
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
          <DialogHeader><DialogTitle>{editing ? t('common.edit') : t('member.members.register')}</DialogTitle></DialogHeader>
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>{t('member.members.phone')}</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('common.name')}</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('member.members.nickname')}</label>
              <Input value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} />
            </div>
            <div>
              <label className='text-sm font-medium'>{t('member.members.level')}</label>
              <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='normal'>{t('member.members.normal')}</SelectItem>
                  <SelectItem value='silver'>{t('member.members.silver')}</SelectItem>
                  <SelectItem value='gold'>{t('member.members.gold')}</SelectItem>
                  <SelectItem value='platinum'>{t('member.members.platinum')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleSave}>{editing ? t('common.save') : t('member.members.register')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
