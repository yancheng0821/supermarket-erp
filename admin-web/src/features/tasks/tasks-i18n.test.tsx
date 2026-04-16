import { readFileSync } from 'node:fs'
import path from 'node:path'
import { useEffect, useRef } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksProvider, useTasks } from './components/tasks-provider'
import { Tasks } from './index'

const { navigateMock, sampleTask } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  sampleTask: {
    id: 'TASK-1001',
    title: '盘点冷藏库库存',
    status: 'in progress',
    label: 'feature',
    priority: 'high',
  },
}))

vi.mock('@tanstack/react-router', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-router')>(
      '@tanstack/react-router'
    )

  return {
    ...actual,
    getRouteApi: () => ({
      useSearch: () => ({}),
      useNavigate: () => navigateMock,
    }),
  }
})

vi.mock('./data/tasks', () => ({
  tasks: [sampleTask],
}))

vi.mock('@/components/layout/header', () => ({
  Header: ({ children }: { children: React.ReactNode }) => (
    <header>{children}</header>
  ),
}))

vi.mock('@/components/layout/main', () => ({
  Main: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => <main className={className}>{children}</main>,
}))

vi.mock('@/components/search', () => ({
  Search: () => <div data-testid='search' />,
}))

vi.mock('@/components/language-switch', () => ({
  LanguageSwitch: () => <div data-testid='language-switch' />,
}))

vi.mock('@/components/theme-switch', () => ({
  ThemeSwitch: () => <div data-testid='theme-switch' />,
}))

vi.mock('@/components/config-drawer', () => ({
  ConfigDrawer: () => <div data-testid='config-drawer' />,
}))

vi.mock('@/components/profile-dropdown', () => ({
  ProfileDropdown: () => <div data-testid='profile-dropdown' />,
}))

function DeleteDialogHarness() {
  const { setCurrentRow, setOpen } = useTasks()
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true
    setCurrentRow(sampleTask)
    setOpen('delete')
  }, [setCurrentRow, setOpen])

  return <TasksDialogs />
}

describe('tasks i18n', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh')
    navigateMock.mockReset()
  })

  it('renders localized tasks page and create dialog', async () => {
    render(<Tasks />)

    expect(screen.getByText('任务')).toBeInTheDocument()
    expect(screen.getByText('查看并处理本月任务清单。')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '导入任务' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '新建任务' })).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('按任务标题或编号筛选')
    ).toBeInTheDocument()
    expect(screen.getByText('任务编号')).toBeInTheDocument()
    expect(screen.getByText('标题')).toBeInTheDocument()
    expect(screen.getAllByText('状态').length).toBeGreaterThan(0)
    expect(screen.getAllByText('优先级').length).toBeGreaterThan(0)
    expect(screen.getByText('盘点冷藏库库存')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '新建任务' }))

    expect(screen.getByText('创建任务')).toBeInTheDocument()
    expect(screen.getByText('填写任务信息并保存变更。')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('请输入任务标题')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()
  })

  it('renders localized import dialog', async () => {
    render(<Tasks />)

    fireEvent.click(screen.getByRole('button', { name: '导入任务' }))

    expect(screen.getAllByText('导入任务').length).toBeGreaterThan(1)
    expect(screen.getByText('通过 CSV 文件快速导入任务。')).toBeInTheDocument()
    expect(screen.getByText('文件')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '导入' })).toBeInTheDocument()
  })

  it('renders localized single delete dialog copy', async () => {
    render(
      <TasksProvider>
        <DeleteDialogHarness />
      </TasksProvider>
    )

    expect(screen.getByText('删除任务 TASK-1001？')).toBeInTheDocument()
    expect(
      screen.getByText('你将删除任务编号 TASK-1001。')
    ).toBeInTheDocument()
    expect(screen.getByText('此操作不可撤销。')).toBeInTheDocument()
  })

  it('renders localized bulk action labels and batch delete dialog', async () => {
    render(<Tasks />)

    await act(async () => {
      fireEvent.click(screen.getByRole('checkbox', { name: '选择当前行' }))
    })

    expect(
      screen.getByRole('button', { name: '更新状态' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '更新优先级' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '导出任务' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '删除所选任务' })
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '删除所选任务' }))

    expect(screen.getByText('删除 1 个任务')).toBeInTheDocument()
    expect(
      screen.getByText('确认输入“删除”：')
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('请输入“删除”以确认')
    ).toBeInTheDocument()
    expect(screen.getByText('警告')).toBeInTheDocument()
    expect(
      screen.getByText('请谨慎操作，此操作无法回滚。')
    ).toBeInTheDocument()
  })

  it('stores task locale keys and removes legacy english strings', () => {
    expect(en).toMatchObject({
      tasks: expect.objectContaining({
        title: 'Tasks',
        createTask: 'Create Task',
      }),
    })

    expect(zh).toMatchObject({
      tasks: expect.objectContaining({
        title: '任务',
        createTask: '创建任务',
      }),
    })

    const files = [
      'index.tsx',
      'components/tasks-primary-buttons.tsx',
      'components/tasks-table.tsx',
      'components/tasks-columns.tsx',
      'components/tasks-mutate-drawer.tsx',
      'components/tasks-import-dialog.tsx',
      'components/data-table-bulk-actions.tsx',
      'components/tasks-multi-delete-dialog.tsx',
      'components/data-table-row-actions.tsx',
      'components/tasks-dialogs.tsx',
      'data/data.tsx',
    ]

    const sources = files.map((file) =>
      readFileSync(
        path.join(path.resolve(import.meta.dirname), file),
        'utf8'
      )
    )

    expect(sources.join('\n')).not.toContain(
      "Here's a list of your tasks for this month!"
    )
    expect(sources.join('\n')).not.toContain('Import Tasks')
    expect(sources.join('\n')).not.toContain('Update status')
    expect(sources.join('\n')).not.toContain('Delete selected tasks')
    expect(sources.join('\n')).not.toContain('Are you sure you want to delete the selected tasks?')
    expect(sources.join('\n')).not.toContain('Make a copy')
    expect(sources.join('\n')).not.toContain('Bug')
    expect(sources.join('\n')).not.toContain('In Progress')
    expect(sources.join('\n')).not.toContain('Critical')
  })
})
