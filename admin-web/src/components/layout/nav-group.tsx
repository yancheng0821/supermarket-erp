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
        isActive={checkIsActive(href, item)}
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
    <Collapsible
      asChild
      defaultOpen={checkIsActive(href, item, true)}
      className='group/collapsible'
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={t(item.title)}>
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
                    isActive={checkIsActive(href, subItem)}
                  >
                    <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                      {subItem.icon && <subItem.icon />}
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
            isActive={checkIsActive(href, item)}
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
                        className={`${checkIsActive(href, leaf) ? 'bg-secondary' : ''}`}
                      >
                        {leaf.icon && <leaf.icon />}
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
                      className={`${checkIsActive(href, sub) ? 'bg-secondary' : ''}`}
                    >
                      {sub.icon && <sub.icon />}
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
    <Collapsible
      defaultOpen={checkIsActive(href, item, true)}
      className='group/nested'
    >
      <CollapsibleTrigger className='flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'>
        {item.icon && <item.icon className='size-4' />}
        <span className='font-medium'>{t(item.title)}</span>
        {item.badge && <NavBadge>{item.badge}</NavBadge>}
        <ChevronRight className='ms-auto size-3.5 transition-transform duration-200 group-data-[state=open]/nested:rotate-90 rtl:rotate-180' />
      </CollapsibleTrigger>
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
                  isActive={checkIsActive(href, subItem)}
                >
                  <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                    {subItem.icon && <subItem.icon />}
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

function checkIsActive(href: string, item: NavItem, mainNav = false): boolean {
  return (
    href === item.url || // /endpint?search=param
    href.split('?')[0] === item.url || // endpoint
    !!item?.items?.some((i) => checkIsActive(href, i)) || // if child nav is active (recursive)
    (mainNav &&
      href.split('/')[1] !== '' &&
      href.split('/')[1] === item?.url?.split('/')[1])
  )
}
