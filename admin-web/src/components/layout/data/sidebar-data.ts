import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  Globe,
  Truck,
  Settings,
  HelpCircle,
  FolderOpen,
  PackageSearch,
  ShoppingBag,
  UserCheck,
  Wallet,
  LineChart,
  Megaphone,
  Building2,
  Handshake,
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
        // 1. 档案 Archive
        {
          title: 'sidebar.archive',
          icon: FolderOpen,
          items: [
            { title: 'sidebar.productMaster', url: '/archive/product-master' },
            { title: 'sidebar.categories', url: '/archive/categories' },
            { title: 'sidebar.brands', url: '/archive/brands' },
            { title: 'sidebar.suppliers', url: '/archive/suppliers' },
            { title: 'sidebar.storeManagement', url: '/archive/stores' },
            { title: 'sidebar.warehouseManagement', url: '/archive/warehouses' },
            { title: 'sidebar.priceManagement', url: '/archive/price-management' },
            { title: 'sidebar.productQuery', url: '/archive/product-query' },
          ],
        },
        // 2. 采购 Purchase
        {
          title: 'sidebar.purchase',
          icon: ShoppingCart,
          items: [
            { title: 'sidebar.purchaseOrders', url: '/purchase/orders' },
            { title: 'sidebar.requisition', url: '/purchase/requisition' },
            { title: 'sidebar.purchasePlan', url: '/purchase/plan' },
            { title: 'sidebar.orderQuery', url: '/purchase/order-query' },
            { title: 'sidebar.autoReplenish', url: '/purchase/auto-replenish' },
            { title: 'sidebar.costAdjustment', url: '/purchase/cost-adjustment' },
          ],
        },
        // 3. 库存 Inventory
        {
          title: 'sidebar.inventory',
          icon: PackageSearch,
          items: [
            { title: 'sidebar.productStock', url: '/inventory/stock' },
            { title: 'sidebar.receiptOrders', url: '/inventory/receipts' },
            { title: 'sidebar.issueOrders', url: '/inventory/issues' },
            { title: 'sidebar.transfers', url: '/inventory/transfers' },
            { title: 'sidebar.stockTakes', url: '/inventory/checks' },
            { title: 'sidebar.inventoryReports', url: '/inventory/reports' },
            { title: 'sidebar.inventoryWarning', url: '/inventory/warning' },
            { title: 'sidebar.damageOverflow', url: '/inventory/damage-overflow' },
          ],
        },
        // 4. 配送 Distribution
        {
          title: 'sidebar.distribution',
          icon: Truck,
          items: [
            { title: 'sidebar.pickingProcess', url: '/distribution/picking' },
            { title: 'sidebar.vehicleDispatch', url: '/distribution/dispatch' },
            { title: 'sidebar.vehicleManagement', url: '/distribution/vehicles' },
            { title: 'sidebar.routeManagement', url: '/distribution/routes' },
            { title: 'sidebar.distributionReports', url: '/distribution/reports' },
          ],
        },
        // 5. 营运 Operation
        {
          title: 'sidebar.operation',
          icon: ShoppingBag,
          items: [
            { title: 'sidebar.posManagement', url: '/operation/pos' },
            { title: 'sidebar.salesOrders', url: '/operation/sales' },
            { title: 'sidebar.cashierShifts', url: '/operation/cashier-shifts' },
            { title: 'sidebar.afterSalesRefund', url: '/operation/refunds' },
            { title: 'sidebar.paymentManagement', url: '/operation/payments' },
            { title: 'sidebar.salesReports', url: '/operation/sales-reports' },
            { title: 'sidebar.priceTagPrinting', url: '/operation/price-tags' },
          ],
        },
        // 6. 线上 Online
        {
          title: 'sidebar.online',
          icon: Globe,
          items: [
            { title: 'sidebar.wechatMiniApp', url: '/online/wechat-mini' },
            { title: 'sidebar.onlineProducts', url: '/online/products' },
            { title: 'sidebar.deliveryOrders', url: '/online/deliveries' },
            { title: 'sidebar.storeConfig', url: '/online/store-config' },
            { title: 'sidebar.aggregatedTakeout', url: '/online/takeout' },
          ],
        },
        // 7. 会员 Member
        {
          title: 'sidebar.member',
          icon: UserCheck,
          items: [
            { title: 'sidebar.memberManagement', url: '/member/management' },
            { title: 'sidebar.cardRecharge', url: '/member/card-recharge' },
            { title: 'sidebar.pointsManagement', url: '/member/points' },
            { title: 'sidebar.coupons', url: '/member/coupons' },
            { title: 'sidebar.memberReports', url: '/member/reports' },
            { title: 'sidebar.storedValueCard', url: '/member/stored-value' },
          ],
        },
        // 8. 营销 Marketing
        {
          title: 'sidebar.marketing',
          icon: Megaphone,
          items: [
            { title: 'sidebar.promotionActivities', url: '/marketing/activities' },
            { title: 'sidebar.scheduledPromotions', url: '/marketing/scheduled' },
            { title: 'sidebar.discountCodes', url: '/marketing/discount-codes' },
            { title: 'sidebar.couponManagement', url: '/marketing/coupons' },
            { title: 'sidebar.marketingReports', url: '/marketing/reports' },
          ],
        },
        // 9. 批发 Wholesale
        {
          title: 'sidebar.wholesale',
          icon: Building2,
          items: [
            { title: 'sidebar.customerManagement', url: '/wholesale/customers' },
            { title: 'sidebar.wholesalePricing', url: '/wholesale/pricing' },
            { title: 'sidebar.wholesaleOrders', url: '/wholesale/orders' },
            { title: 'sidebar.wholesaleReports', url: '/wholesale/reports' },
          ],
        },
        // 10. 加盟 Franchise
        {
          title: 'sidebar.franchise',
          icon: Handshake,
          items: [
            { title: 'sidebar.franchiseeManagement', url: '/franchise/management' },
            { title: 'sidebar.franchiseeSettlement', url: '/franchise/settlement' },
          ],
        },
        // 11. 财务 Finance
        {
          title: 'sidebar.finance',
          icon: Wallet,
          items: [
            { title: 'sidebar.supplierSettlement', url: '/finance/supplier-settlement' },
            { title: 'sidebar.storeSettlement', url: '/finance/store-settlement' },
            { title: 'sidebar.feeManagement', url: '/finance/fees' },
            { title: 'sidebar.voucherManagement', url: '/finance/vouchers' },
            { title: 'sidebar.wholesaleSettlement', url: '/finance/wholesale-settlement' },
            { title: 'sidebar.financeReports', url: '/finance/reports' },
          ],
        },
        // 12. 数据 Analytics
        {
          title: 'sidebar.analytics',
          icon: LineChart,
          items: [
            { title: 'sidebar.storeDailyReport', url: '/analytics/daily-report' },
            { title: 'sidebar.salesAnalysis', url: '/analytics/sales-analysis' },
            { title: 'sidebar.productAnalysis', url: '/analytics/product-analysis' },
            { title: 'sidebar.supplierReports', url: '/analytics/supplier-reports' },
            { title: 'sidebar.digitalScreen', url: '/analytics/digital-screen' },
            { title: 'sidebar.budgetManagement', url: '/analytics/budget' },
            { title: 'sidebar.marketingAnalytics', url: '/analytics/marketing' },
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
            { title: 'sidebar.profile', url: '/settings' },
            { title: 'sidebar.account', url: '/settings/account' },
            { title: 'sidebar.appearance', url: '/settings/appearance' },
            { title: 'sidebar.notifications', url: '/settings/notifications' },
            { title: 'sidebar.display', url: '/settings/display' },
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
