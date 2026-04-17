import { type ReactNode } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ChevronRight } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  type NavCollapsible,
  type NavItem,
  type NavLink,
  type NavGroup as NavGroupProps,
} from './types'

export function NavGroup({ title, items }: NavGroupProps) {
  const { t } = useTranslation()
  const { state, isMobile } = useSidebar()
  const href = useLocation({ select: (location) => location.href })
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t(title)}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.url}`

          if (!item.items)
            return <SidebarMenuLink key={key} item={item} href={href} />

          if (state === 'collapsed' && !isMobile)
            return (
              <SidebarMenuCollapsedDropdown key={key} item={item} href={href} />
            )

          return <SidebarMenuCollapsible key={key} item={item} href={href} />
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavBadge({ children }: { children: ReactNode }) {
  return <Badge className='rounded-full px-1 py-0 text-xs'>{children}</Badge>
}

function SidebarMenuLink({ item, href }: { item: NavLink; href: string }) {
  const { t } = useTranslation()
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isItemActive(href, item)}
        tooltip={t(item.title)}
      >
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{t(item.title)}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarMenuCollapsible({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) {
  const { t } = useTranslation()
  const { setOpenMobile } = useSidebar()
  return (
    <Collapsible asChild className='group/collapsible'>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={t(item.title)}
            isCurrent={isCurrentBranch(href, item)}
          >
            {item.icon && <item.icon />}
            <span>{t(item.title)}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className='CollapsibleContent'>
          <SidebarMenuSub>
            {item.items.map((subItem) =>
              subItem.items ? (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarNestedCollapsible item={subItem as NavCollapsible} href={href} />
                </SidebarMenuSubItem>
              ) : (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isItemActive(href, subItem)}
                  >
                    <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                      <span>{t(subItem.title)}</span>
                      {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function SidebarMenuCollapsedDropdown({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) {
  const { t } = useTranslation()
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={t(item.title)}
            isCurrent={isCurrentBranch(href, item)}
          >
            {item.icon && <item.icon />}
            <span>{t(item.title)}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start' sideOffset={4}>
          <DropdownMenuLabel>
            {t(item.title)} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.flatMap((sub) =>
            sub.items
              ? [
                  <DropdownMenuLabel key={`label-${sub.title}`} className='text-xs text-muted-foreground'>
                    {t(sub.title)}
                  </DropdownMenuLabel>,
                  ...sub.items.map((leaf) => (
                    <DropdownMenuItem key={`${leaf.title}-${leaf.url}`} asChild>
                      <Link
                        to={leaf.url!}
                        className={
                          isItemActive(href, leaf)
                            ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                            : ''
                        }
                      >
                        <span className='max-w-52 text-wrap'>{t(leaf.title)}</span>
                        {leaf.badge && (
                          <span className='ms-auto text-xs'>{leaf.badge}</span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  )),
                ]
              : [
                  <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
                    <Link
                      to={sub.url!}
                      className={
                        isItemActive(href, sub)
                          ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                          : ''
                      }
                    >
                      <span className='max-w-52 text-wrap'>{t(sub.title)}</span>
                      {sub.badge && (
                        <span className='ms-auto text-xs'>{sub.badge}</span>
                      )}
                    </Link>
                  </DropdownMenuItem>,
                ]
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function SidebarNestedCollapsible({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) {
  const { t } = useTranslation()
  const { setOpenMobile } = useSidebar()
  return (
    <Collapsible className='group/nested'>
      <SidebarMenuSubButton asChild isCurrent={isCurrentBranch(href, item)}>
        <CollapsibleTrigger>
          <span>{t(item.title)}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
          <ChevronRight className='ms-auto size-3.5 transition-transform duration-200 group-data-[state=open]/nested:rotate-90 rtl:rotate-180' />
        </CollapsibleTrigger>
      </SidebarMenuSubButton>
      <CollapsibleContent className='CollapsibleContent'>
        <SidebarMenuSub className='pl-3'>
          {item.items.map((subItem) =>
            subItem.items ? (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarNestedCollapsible item={subItem as NavCollapsible} href={href} />
              </SidebarMenuSubItem>
            ) : (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={isItemActive(href, subItem)}
                >
                  <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                    <span>{t(subItem.title)}</span>
                    {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            )
          )}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

function normalizeHref(href: string) {
  return href.split('?')[0] ?? href
}

function matchesItemUrl(href: string, item: NavItem) {
  const currentHref = normalizeHref(href)
  return [item.url, item.matchUrl].some(
    (candidate) => !!candidate && currentHref === candidate
  )
}

function isItemActive(href: string, item: NavItem): boolean {
  return !item.items && matchesItemUrl(href, item)
}

function isCurrentBranch(href: string, item: NavItem): boolean {
  return matchesItemUrl(href, item) || !!item.items?.some((i) => isCurrentBranch(href, i))
}
