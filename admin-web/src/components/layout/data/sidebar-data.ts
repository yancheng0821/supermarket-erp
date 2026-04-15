import {
  LayoutDashboard,
  Store,
  Warehouse,
  Package,
  ShoppingCart,
  ClipboardList,
  Boxes,
  ArrowRightLeft,
  Users,
  CreditCard,
  Gift,
  Ticket,
  Globe,
  Truck,
  DollarSign,
  Receipt,
  FileText,
  BarChart3,
  TrendingUp,
  Settings,
  UserCog,
  Wrench,
  Palette,
  Bell,
  Monitor,
  HelpCircle,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@supermarket-erp.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Supermarket ERP',
      logo: Store,
      plan: 'Multi-tenant SaaS',
    },
  ],
  navGroups: [
    {
      title: 'Overview',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Archive',
      items: [
        {
          title: 'Stores',
          url: '/archive/stores',
          icon: Store,
        },
        {
          title: 'Warehouses',
          url: '/archive/warehouses',
          icon: Warehouse,
        },
        {
          title: 'Products',
          url: '/archive/products',
          icon: Package,
        },
        {
          title: 'Categories',
          url: '/archive/categories',
          icon: ClipboardList,
        },
        {
          title: 'Suppliers',
          url: '/archive/suppliers',
          icon: Truck,
        },
      ],
    },
    {
      title: 'Purchase',
      items: [
        {
          title: 'Purchase Orders',
          url: '/purchase/orders',
          icon: ShoppingCart,
        },
        {
          title: 'Replenish Plans',
          url: '/purchase/replenish',
          icon: ClipboardList,
        },
      ],
    },
    {
      title: 'Inventory',
      items: [
        {
          title: 'Stock Overview',
          url: '/inventory/stock',
          icon: Boxes,
        },
        {
          title: 'Receipt Orders',
          url: '/inventory/receipts',
          icon: ClipboardList,
        },
        {
          title: 'Issue Orders',
          url: '/inventory/issues',
          icon: ClipboardList,
        },
        {
          title: 'Transfers',
          url: '/inventory/transfers',
          icon: ArrowRightLeft,
        },
        {
          title: 'Stock Takes',
          url: '/inventory/checks',
          icon: ClipboardList,
        },
      ],
    },
    {
      title: 'Operation',
      items: [
        {
          title: 'Sales Orders',
          url: '/operation/sales',
          icon: CreditCard,
        },
        {
          title: 'Payments',
          url: '/operation/payments',
          icon: DollarSign,
        },
        {
          title: 'Cashier Shifts',
          url: '/operation/cashier-shifts',
          icon: Receipt,
        },
        {
          title: 'Refunds',
          url: '/operation/refunds',
          icon: ArrowRightLeft,
        },
      ],
    },
    {
      title: 'Member',
      items: [
        {
          title: 'Members',
          url: '/member/members',
          icon: Users,
        },
        {
          title: 'Points',
          url: '/member/points',
          icon: Gift,
        },
        {
          title: 'Coupons',
          url: '/member/coupons',
          icon: Ticket,
        },
      ],
    },
    {
      title: 'Online',
      items: [
        {
          title: 'Online Products',
          url: '/online/products',
          icon: Globe,
        },
        {
          title: 'Delivery Orders',
          url: '/online/deliveries',
          icon: Truck,
        },
        {
          title: 'Store Config',
          url: '/online/store-config',
          icon: Settings,
        },
      ],
    },
    {
      title: 'Finance',
      items: [
        {
          title: 'Supplier Settlement',
          url: '/finance/supplier-settlement',
          icon: FileText,
        },
        {
          title: 'Store Settlement',
          url: '/finance/store-settlement',
          icon: FileText,
        },
        {
          title: 'Fee Records',
          url: '/finance/fees',
          icon: Receipt,
        },
        {
          title: 'Vouchers',
          url: '/finance/vouchers',
          icon: FileText,
        },
      ],
    },
    {
      title: 'Analytics',
      items: [
        {
          title: 'Daily Sales',
          url: '/analytics/daily-sales',
          icon: BarChart3,
        },
        {
          title: 'Product Sales',
          url: '/analytics/product-sales',
          icon: TrendingUp,
        },
        {
          title: 'Inventory Snapshot',
          url: '/analytics/inventory',
          icon: Boxes,
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
