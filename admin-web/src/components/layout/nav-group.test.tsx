import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'
import { SidebarProvider } from '@/components/ui/sidebar'
import { NavGroup } from './nav-group'
import type { NavGroup as NavGroupProps } from './types'

let currentHref = '/system/users/create'
const TestIcon = () => <svg data-testid='menu-icon' />

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useLocation: ({
    select,
  }: {
    select?: (location: { href: string }) => unknown
  } = {}) => (select ? select({ href: currentHref }) : { href: currentHref }),
}))

const navGroup: NavGroupProps = {
  title: 'Management',
  items: [
    {
      title: 'System Management',
      icon: TestIcon,
      items: [
        {
          title: 'User Management',
          icon: TestIcon,
          items: [
            {
              title: 'Create User',
              url: '/system/users/create',
              icon: TestIcon,
            },
          ],
        },
      ],
    },
  ],
}

function renderNavGroup() {
  return render(
    <SidebarProvider>
      <NavGroup {...navGroup} />
    </SidebarProvider>
  )
}

describe('NavGroup', () => {
  beforeEach(async () => {
    currentHref = '/system/users/create'
    await i18n.changeLanguage('zh')
  })

  it('keeps active branches collapsed on first render', () => {
    const { container } = renderNavGroup()

    expect(
      container.querySelectorAll('[data-slot="collapsible"][data-state="open"]')
    ).toHaveLength(0)
  })

  it('keeps parent items as current branch and reserves active state for the leaf', async () => {
    const user = userEvent.setup()
    renderNavGroup()

    const systemButton = screen.getByRole('button', {
      name: 'System Management',
    })

    expect(systemButton).toHaveAttribute('data-current', 'true')
    expect(systemButton).toHaveAttribute('data-active', 'false')

    await user.click(systemButton)

    const userButton = screen.getByRole('button', {
      name: 'User Management',
    })

    expect(userButton).toHaveAttribute('data-current', 'true')
    expect(userButton).toHaveAttribute('data-active', 'false')
    expect(userButton.className).toContain('hover:bg-sidebar-accent')
    expect(userButton.className).toContain('hover:text-sidebar-accent-foreground')
    expect(userButton.className).not.toContain('data-[current=true]:bg-sidebar-accent')
    expect(userButton.className).toContain(
      'data-[current=true]:text-sidebar-accent-foreground'
    )
    expect(userButton.className).toContain('data-[current=true]:font-medium')
    expect(screen.getAllByTestId('menu-icon')).toHaveLength(1)

    await user.click(userButton)

    const createUserLink = screen.getByRole('link', { name: 'Create User' })

    expect(createUserLink).toHaveAttribute('data-active', 'true')
    expect(createUserLink).toHaveAttribute('data-current', 'false')
    expect(createUserLink.className).toContain('hover:bg-sidebar-accent')
    expect(createUserLink.className).toContain(
      'hover:text-sidebar-accent-foreground'
    )
    expect(createUserLink.className).toContain(
      'data-[active=true]:bg-sidebar-accent'
    )
    expect(createUserLink.className).toContain(
      'data-[active=true]:text-sidebar-accent-foreground'
    )
    expect(createUserLink.className).toContain('data-[active=true]:font-medium')
    expect(screen.getAllByTestId('menu-icon')).toHaveLength(1)
  })
})
