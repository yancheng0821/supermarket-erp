import { useEffect, useState, useMemo } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown } from 'lucide-react'

interface Category {
  id: number
  name: string
  parentId: number
  sort: number
  status: number
  children?: Category[]
}

function buildTree(list: Category[]): Category[] {
  const map = new Map<number, Category>()
  const roots: Category[] = []

  list.forEach((item) => {
    map.set(item.id, { ...item, children: [] })
  })

  list.forEach((item) => {
    const node = map.get(item.id)!
    if (item.parentId === 0 || !map.has(item.parentId)) {
      roots.push(node)
    } else {
      map.get(item.parentId)!.children!.push(node)
    }
  })

  return roots
}

function TreeNode({
  node, level, onEdit, onDelete, expanded, onToggle,
}: {
  node: Category
  level: number
  onEdit: (c: Category) => void
  onDelete: (id: number) => void
  expanded: Set<number>
  onToggle: (id: number) => void
}) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expanded.has(node.id)

  return (
    <>
      <div
        className='flex items-center gap-2 py-2 px-3 hover:bg-muted/50 rounded-md'
        style={{ paddingLeft: `${level * 24 + 12}px` }}
      >
        <button
          className='w-5 h-5 flex items-center justify-center shrink-0'
          onClick={() => hasChildren && onToggle(node.id)}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />
          ) : <span className='w-4' />}
        </button>
        <span className='font-medium flex-1'>{node.name}</span>
        <span className='text-sm text-muted-foreground w-16 text-center'>#{node.sort}</span>
        <Badge variant={node.status === 0 ? 'default' : 'secondary'} className='w-16 justify-center'>
          {node.status === 0 ? 'Active' : 'Inactive'}
        </Badge>
        <div className='flex gap-1'>
          <Button variant='ghost' size='icon' className='h-7 w-7' onClick={() => onEdit(node)}>
            <Pencil className='h-3.5 w-3.5' />
          </Button>
          <Button variant='ghost' size='icon' className='h-7 w-7' onClick={() => onDelete(node.id)}>
            <Trash2 className='h-3.5 w-3.5' />
          </Button>
        </div>
      </div>
      {hasChildren && isExpanded && node.children!.map((child) => (
        <TreeNode
          key={child.id}
          node={child}
          level={level + 1}
          onEdit={onEdit}
          onDelete={onDelete}
          expanded={expanded}
          onToggle={onToggle}
        />
      ))}
    </>
  )
}

export function CategoriesPage() {
  const [list, setList] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Category | null>(null)
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [form, setForm] = useState({ name: '', parentId: '0', sort: '0' })

  const tree = useMemo(() => buildTree(list), [list])

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await api.get<Category[]>('/admin/archive/category/tree')
      setList(result)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const onToggle = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const expandAll = () => {
    setExpanded(new Set(list.map((c) => c.id)))
  }

  const openCreate = () => {
    setEditingItem(null)
    setForm({ name: '', parentId: '0', sort: '0' })
    setDialogOpen(true)
  }

  const openEdit = (item: Category) => {
    setEditingItem(item)
    setForm({
      name: item.name || '',
      parentId: String(item.parentId ?? 0),
      sort: String(item.sort ?? 0),
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const payload = { name: form.name, parentId: Number(form.parentId), sort: Number(form.sort) }
      if (editingItem) {
        await api.put('/admin/archive/category', { id: editingItem.id, ...payload })
        toast.success('Category updated')
      } else {
        await api.post('/admin/archive/category', payload)
        toast.success('Category created')
      }
      setDialogOpen(false)
      fetchData()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Operation failed')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category? Child categories may be affected.')) return
    try {
      await api.del(`/admin/archive/category/${id}`)
      toast.success('Category deleted')
      fetchData()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  // Flat list of categories for parent select (exclude self when editing)
  const parentOptions = list.filter((c) => !editingItem || c.id !== editingItem.id)

  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Categories</h2>
            <p className='text-muted-foreground'>Manage product category tree.</p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={expandAll}>Expand All</Button>
            <Button onClick={openCreate}><Plus className='mr-2 h-4 w-4' /> New Category</Button>
          </div>
        </div>

        <div className='rounded-md border p-2'>
          {loading ? (
            <div className='text-center py-8 text-muted-foreground'>Loading...</div>
          ) : tree.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>No categories found.</div>
          ) : (
            tree.map((node) => (
              <TreeNode
                key={node.id}
                node={node}
                level={0}
                onEdit={openEdit}
                onDelete={handleDelete}
                expanded={expanded}
                onToggle={onToggle}
              />
            ))
          )}
        </div>
      </Main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Category' : 'New Category'}</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <Input placeholder='Category name *' value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
            <Select value={form.parentId} onValueChange={(v) => setForm({...form, parentId: v})}>
              <SelectTrigger><SelectValue placeholder='Parent category' /></SelectTrigger>
              <SelectContent>
                <SelectItem value='0'>Root (no parent)</SelectItem>
                {parentOptions.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder='Sort order' type='number' value={form.sort} onChange={(e) => setForm({...form, sort: e.target.value})} />
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingItem ? 'Save' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
