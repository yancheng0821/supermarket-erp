import { render, screen, waitFor } from '@testing-library/react'
import type { Table } from '@tanstack/react-table'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { type User } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { UsersActionDialog } from './users-action-dialog'
import { UsersDeleteDialog } from './users-delete-dialog'
import { UsersInviteDialog } from './users-invite-dialog'
import { UsersMultiDeleteDialog } from './users-multi-delete-dialog'
import { UsersPrimaryButtons } from './users-primary-buttons'
import { UsersProvider } from './users-provider'
import { UsersTable } from './users-table'

const navigateMock = vi.fn()

const sampleUser: User = {
  id: '1',
  firstName: 'Zhang',
  lastName: 'San',
  username: 'zhangsan',
  email: 'zhangsan@example.com',
  phoneNumber: '13800000000',
  status: 'active',
  role: 'admin',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-02T00:00:00Z'),
}

function createSelectedTableMock(): Table<User> {
  return {
    getFilteredSelectedRowModel: () => ({
      rows: [{ original: sampleUser }],
    }),
    resetRowSelection: vi.fn(),
  } as unknown as Table<User>
}

describe('users localization', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh')
    navigateMock.mockReset()
  })

  it('renders localized primary actions and table copy', () => {
    render(
      <UsersProvider>
        <UsersPrimaryButtons />
        <UsersTable data={[]} search={{}} navigate={navigateMock} />
      </UsersProvider>
    )

    expect(
      screen.getByRole('button', { name: /邀请用户/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /新增用户/i })
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('按用户名搜索...')
    ).toBeInTheDocument()
    expect(screen.getByText('用户名')).toBeInTheDocument()
    expect(screen.getByText('姓名')).toBeInTheDocument()
    expect(screen.getByText('邮箱')).toBeInTheDocument()
    expect(screen.getByText('手机号')).toBeInTheDocument()
    expect(screen.getAllByText('状态').length).toBeGreaterThan(0)
    expect(screen.getAllByText('角色').length).toBeGreaterThan(0)
    expect(screen.getByText('暂无结果')).toBeInTheDocument()
  })

  it('renders localized user action dialogs', () => {
    render(
      <>
        <UsersActionDialog
          open
          onOpenChange={vi.fn()}
          currentRow={sampleUser}
        />
        <UsersInviteDialog open onOpenChange={vi.fn()} />
        <UsersDeleteDialog
          open
          onOpenChange={vi.fn()}
          currentRow={sampleUser}
        />
      </>
    )

    expect(screen.getByText('编辑用户')).toBeInTheDocument()
    expect(screen.getAllByText('邀请用户').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('删除用户')).toBeInTheDocument()
    expect(screen.getAllByText('用户名').length).toBeGreaterThan(0)
    expect(screen.getAllByText('角色').length).toBeGreaterThan(0)
    expect(screen.getByText('确认密码')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('请输入名')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('请输入邀请邮箱')).toBeInTheDocument()
  })

  it('renders localized bulk action labels', async () => {
    const table = createSelectedTableMock()

    render(<DataTableBulkActions table={table} />)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: '邀请所选用户' })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: '启用所选用户' })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: '停用所选用户' })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: '删除所选用户' })
      ).toBeInTheDocument()
    })
  })

  it('renders localized batch delete dialog', () => {
    const table = createSelectedTableMock()

    render(
      <UsersMultiDeleteDialog
        open
        onOpenChange={vi.fn()}
        table={table}
      />
    )

    expect(screen.getByText('删除 1 个用户')).toBeInTheDocument()
    expect(screen.getByText('警告')).toBeInTheDocument()
  })
})
