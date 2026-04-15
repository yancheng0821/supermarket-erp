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
  FolderOpen,
  PackageSearch,
  ShoppingBag,
  UserCheck,
  Wallet,
  LineChart,
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
      plan: 'app.tagline',
    },
  ],
  navGroups: [
    {
      title: 'sidebar.overview',
      items: [
        {
          title: 'sidebar.dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'sidebar.businessModules',
      items: [
        {
          title: 'sidebar.archive',
          icon: FolderOpen,
          items: [
            { title: 'sidebar.stores', url: '/archive/stores', icon: Store },
            { title: 'sidebar.warehouses', url: '/archive/warehouses', icon: Warehouse },
            { title: 'sidebar.products', url: '/archive/products', icon: Package },
            { title: 'sidebar.categories', url: '/archive/categories', icon: ClipboardList },
            { title: 'sidebar.suppliers', url: '/archive/suppliers', icon: Truck },
          ],
        },
        {
          title: 'sidebar.purchase',
          icon: ShoppingCart,
          items: [
            { title: 'sidebar.purchaseOrders', url: '/purchase/orders', icon: ShoppingCart },
            { title: 'sidebar.replenishPlans', url: '/purchase/replenish', icon: ClipboardList },
          ],
        },
        {
          title: 'sidebar.inventory',
          icon: PackageSearch,
          items: [
            { title: 'sidebar.stockOverview', url: '/inventory/stock', icon: Boxes },
            { title: 'sidebar.receiptOrders', url: '/inventory/receipts', icon: ClipboardList },
            { title: 'sidebar.issueOrders', url: '/inventory/issues', icon: ClipboardList },
            { title: 'sidebar.transfers', url: '/inventory/transfers', icon: ArrowRightLeft },
            { title: 'sidebar.stockTakes', url: '/inventory/checks', icon: ClipboardList },
          ],
        },
        {
          title: 'sidebar.operation',
          icon: ShoppingBag,
          items: [
            { title: 'sidebar.salesOrders', url: '/operation/sales', icon: CreditCard },
            { title: 'sidebar.payments', url: '/operation/payments', icon: DollarSign },
            { title: 'sidebar.cashierShifts', url: '/operation/cashier-shifts', icon: Receipt },
            { title: 'sidebar.refunds', url: '/operation/refunds', icon: ArrowRightLeft },
          ],
        },
        {
          title: 'sidebar.member',
          icon: UserCheck,
          items: [
            { title: 'sidebar.members', url: '/member/members', icon: Users },
            { title: 'sidebar.points', url: '/member/points', icon: Gift },
            { title: 'sidebar.coupons', url: '/member/coupons', icon: Ticket },
          ],
        },
        {
          title: 'sidebar.online',
          icon: Globe,
          items: [
            { title: 'sidebar.onlineProducts', url: '/online/products', icon: Globe },
            { title: 'sidebar.deliveryOrders', url: '/online/deliveries', icon: Truck },
            { title: 'sidebar.storeConfig', url: '/online/store-config', icon: Settings },
          ],
        },
        {
          title: 'sidebar.finance',
          icon: Wallet,
          items: [
            { title: 'sidebar.supplierSettlement', url: '/finance/supplier-settlement', icon: FileText },
            { title: 'sidebar.storeSettlement', url: '/finance/store-settlement', icon: FileText },
            { title: 'sidebar.feeRecords', url: '/finance/fees', icon: Receipt },
            { title: 'sidebar.vouchers', url: '/finance/vouchers', icon: FileText },
          ],
        },
        {
          title: 'sidebar.analytics',
          icon: LineChart,
          items: [
            { title: 'sidebar.dailySales', url: '/analytics/daily-sales', icon: BarChart3 },
            { title: 'sidebar.productSales', url: '/analytics/product-sales', icon: TrendingUp },
            { title: 'sidebar.inventorySnapshot', url: '/analytics/inventory', icon: Boxes },
          ],
        },
      ],
    },
    {
      title: 'sidebar.system',
      items: [
        {
          title: 'sidebar.settings',
          icon: Settings,
          items: [
            { title: 'sidebar.profile', url: '/settings', icon: UserCog },
            { title: 'sidebar.account', url: '/settings/account', icon: Wrench },
            { title: 'sidebar.appearance', url: '/settings/appearance', icon: Palette },
            { title: 'sidebar.notifications', url: '/settings/notifications', icon: Bell },
            { title: 'sidebar.display', url: '/settings/display', icon: Monitor },
          ],
        },
        {
          title: 'sidebar.helpCenter',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
