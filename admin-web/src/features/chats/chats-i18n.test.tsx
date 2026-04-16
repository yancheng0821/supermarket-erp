import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'
import { Chats } from './index'

vi.mock('@/components/layout/header', () => ({
  Header: ({ children }: { children: React.ReactNode }) => <header>{children}</header>,
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

describe('chats i18n', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('zh')
  })

  it('renders localized chat list and empty state copy', () => {
    render(<Chats />)

    expect(screen.getByText('收件箱')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '新建消息' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('搜索会话...')).toBeInTheDocument()
    expect(screen.getByText('你：回头见，Alex！')).toBeInTheDocument()
    expect(screen.getByText('你的消息')).toBeInTheDocument()
    expect(screen.getByText('发送一条消息以开始聊天。')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '发送消息' })).toBeInTheDocument()
  })

  it('renders localized selected conversation and new chat dialog', async () => {
    render(<Chats />)

    fireEvent.click(screen.getByRole('button', { name: /Alex John/i }))

    expect(await screen.findByText('高级后端开发')).toBeInTheDocument()
    expect(screen.getByText('回头见，Alex！')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('输入消息内容...')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '新建消息' }))

    expect(screen.getByText('新建消息')).toBeInTheDocument()
    expect(screen.getByText('收件人：')).toBeInTheDocument()
    fireEvent.change(screen.getByPlaceholderText('搜索联系人...'), {
      target: { value: 'zzz' },
    })
    expect(await screen.findByText('未找到联系人。')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '开始聊天' })).toBeInTheDocument()
  })

  it('stores chat locale keys and removes legacy english strings', () => {
    expect(en).toMatchObject({
      chats: expect.objectContaining({
        title: 'Inbox',
        emptyTitle: 'Your messages',
        newChat: expect.objectContaining({
          title: 'New message',
        }),
      }),
    })

    expect(zh).toMatchObject({
      chats: expect.objectContaining({
        title: '收件箱',
        emptyTitle: '你的消息',
        newChat: expect.objectContaining({
          title: '新建消息',
        }),
      }),
    })

    const sourceDir = path.resolve(import.meta.dirname)
    const sourceFiles = [
      'index.tsx',
      path.join('components', 'new-chat.tsx'),
      path.join('data', 'chat-types.ts'),
      path.join('data', 'conversations.ts'),
      path.join('data', 'convo.json'),
    ]

    const sources = sourceFiles
      .map((file) => path.join(sourceDir, file))
      .filter((file) => existsSync(file))
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n')

    expect(sources).not.toContain('Inbox')
    expect(sources).not.toContain('Search chat...')
    expect(sources).not.toContain('New message')
    expect(sources).not.toContain('Type your messages...')
    expect(sources).not.toContain('Your messages')
    expect(sources).not.toContain('Senior Backend Dev')
    expect(sources).not.toContain('See you later, Alex!')
  })
})
