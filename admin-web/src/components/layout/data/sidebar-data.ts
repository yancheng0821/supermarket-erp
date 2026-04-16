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
        // ==================== 1. 档案 Archive ====================
        {
          title: 'sidebar.archive',
          icon: FolderOpen,
          items: [
            {
              title: 'sidebar.orgArchive',
              items: [
                { title: 'sidebar.deliveryZone', url: '/archive/delivery-zone' },
                { title: 'sidebar.orgManagement', url: '/archive/org-management' },
                { title: 'sidebar.businessDimension', url: '/archive/business-dimension' },
                { title: 'sidebar.dcVersionConfig', url: '/archive/dc-version-config' },
              ],
            },
            {
              title: 'sidebar.priceManagement',
              items: [
                { title: 'sidebar.costPriceAdjust', url: '/archive/cost-price-adjust' },
                { title: 'sidebar.retailPriceAdjust', url: '/archive/retail-price-adjust' },
                { title: 'sidebar.deliveryPriceAdjust', url: '/archive/delivery-price-adjust' },
                { title: 'sidebar.comprehensivePriceAdjust', url: '/archive/comprehensive-price-adjust' },
                { title: 'sidebar.deliveryMarkupRule', url: '/archive/delivery-markup-rule' },
                { title: 'sidebar.deliveryMarkupAdjust', url: '/archive/delivery-markup-adjust' },
                { title: 'sidebar.freshRetailPriceAdjust', url: '/archive/fresh-retail-price-adjust' },
                { title: 'sidebar.freshComprehensivePriceAdjust', url: '/archive/fresh-comprehensive-price-adjust' },
              ],
            },
            {
              title: 'sidebar.archiveQuery',
              items: [
                { title: 'sidebar.costPriceChangeQuery', url: '/archive/cost-price-change-query' },
                { title: 'sidebar.retailPriceChangeQuery', url: '/archive/retail-price-change-query' },
                { title: 'sidebar.costPriceQuery', url: '/archive/cost-price-query' },
                { title: 'sidebar.retailPriceQuery', url: '/archive/retail-price-query' },
                { title: 'sidebar.deliveryPriceQuery', url: '/archive/delivery-price-query' },
                { title: 'sidebar.productComprehensiveQuery', url: '/archive/product-comprehensive-query' },
                { title: 'sidebar.productLifecycleQuery', url: '/archive/product-lifecycle-query' },
                { title: 'sidebar.productAnomalyQuery', url: '/archive/product-anomaly-query' },
              ],
            },
            {
              title: 'sidebar.supplierArchive',
              items: [
                { title: 'sidebar.supplierList', url: '/archive/supplier-list' },
                { title: 'sidebar.supplierRegion', url: '/archive/supplier-region' },
                { title: 'sidebar.supplierLifecycle', url: '/archive/supplier-lifecycle' },
                { title: 'sidebar.newSupplierApply', url: '/archive/new-supplier-apply' },
                { title: 'sidebar.contractManagement', url: '/archive/contract-management' },
                { title: 'sidebar.supplyQualification', url: '/archive/supply-qualification' },
                { title: 'sidebar.supplyQualificationChange', url: '/archive/supply-qualification-change' },
                { title: 'sidebar.productTransferSupplier', url: '/archive/product-transfer-supplier' },
              ],
            },
            {
              title: 'sidebar.paymentArchive',
              items: [
                { title: 'sidebar.paymentMethodManagement', url: '/archive/payment-method-management' },
                { title: 'sidebar.settlementAccountManagement', url: '/archive/settlement-account-management' },
                { title: 'sidebar.terminalInfoReport', url: '/archive/terminal-info-report' },
                { title: 'sidebar.posPaymentSortConfig', url: '/archive/pos-payment-sort-config' },
              ],
            },
            {
              title: 'sidebar.warehouseArchive',
              items: [
                { title: 'sidebar.warehouseManagement', url: '/archive/warehouse-management' },
                { title: 'sidebar.warehouseZoneManagement', url: '/archive/warehouse-zone-management' },
                { title: 'sidebar.shelfManagement', url: '/archive/shelf-management' },
                { title: 'sidebar.shelfProductInfo', url: '/archive/shelf-product-info' },
              ],
            },
            {
              title: 'sidebar.productArchive',
              items: [
                { title: 'sidebar.productList', url: '/archive/product-list' },
                { title: 'sidebar.categoryList', url: '/archive/category-list' },
                { title: 'sidebar.brandList', url: '/archive/brand-list' },
                { title: 'sidebar.unitList', url: '/archive/unit-list' },
                { title: 'sidebar.productDepartment', url: '/archive/product-department' },
                { title: 'sidebar.seasonList', url: '/archive/season-list' },
                { title: 'sidebar.taxRateList', url: '/archive/tax-rate-list' },
                { title: 'sidebar.newProductApply', url: '/archive/new-product-apply' },
                { title: 'sidebar.productLifecycle', url: '/archive/product-lifecycle' },
                { title: 'sidebar.storeProduct', url: '/archive/store-product' },
                { title: 'sidebar.dcProduct', url: '/archive/dc-product' },
                { title: 'sidebar.bomList', url: '/archive/bom-list' },
                { title: 'sidebar.shelfProduct', url: '/archive/shelf-product' },
                { title: 'sidebar.shelfList', url: '/archive/shelf-list' },
                { title: 'sidebar.productBatchEdit', url: '/archive/product-batch-edit' },
                { title: 'sidebar.eInvoiceList', url: '/archive/e-invoice-list' },
              ],
            },
          ],
        },
        // ==================== 2. 采购 Purchase ====================
        {
          title: 'sidebar.purchase',
          icon: ShoppingCart,
          items: [
            {
              title: 'sidebar.purchaseOrders',
              items: [
                { title: 'sidebar.centralizedOrder', url: '/purchase/centralized-order' },
                { title: 'sidebar.directOrder', url: '/purchase/direct-order' },
                { title: 'sidebar.crossDockOrder', url: '/purchase/cross-dock-order' },
                { title: 'sidebar.selfPurchaseOrder', url: '/purchase/self-purchase-order' },
                { title: 'sidebar.selfPurchaseSummary', url: '/purchase/self-purchase-summary' },
                { title: 'sidebar.selfPurchaseArrivalAnalysis', url: '/purchase/self-purchase-arrival-analysis' },
              ],
            },
            {
              title: 'sidebar.purchaseQuery',
              items: [
                { title: 'sidebar.orderQuery', url: '/purchase/order-query' },
                { title: 'sidebar.orderDetailQuery', url: '/purchase/order-detail-query' },
                { title: 'sidebar.requisitionSummaryQuery', url: '/purchase/requisition-summary-query' },
              ],
            },
            {
              title: 'sidebar.costBusiness',
              items: [
                { title: 'sidebar.batchTransfer', url: '/purchase/batch-transfer' },
                { title: 'sidebar.costAdjustmentOrder', url: '/purchase/cost-adjustment-order' },
                { title: 'sidebar.costAdjustmentQuery', url: '/purchase/cost-adjustment-query' },
              ],
            },
            {
              title: 'sidebar.storeRequisition',
              items: [
                { title: 'sidebar.requisitionOrder', url: '/purchase/requisition-order' },
                { title: 'sidebar.purchasePlanOrder', url: '/purchase/purchase-plan-order' },
                { title: 'sidebar.requisitionSummaryList', url: '/purchase/requisition-summary-list' },
                { title: 'sidebar.storeRequisitionReport', url: '/purchase/store-requisition-report' },
              ],
            },
            {
              title: 'sidebar.deliveryProcessing',
              items: [
                { title: 'sidebar.distributionProcess', url: '/purchase/distribution-process' },
                { title: 'sidebar.centralizedReplenish', url: '/purchase/centralized-replenish' },
                { title: 'sidebar.crossDockReplenish', url: '/purchase/cross-dock-replenish' },
                { title: 'sidebar.directReplenish', url: '/purchase/direct-replenish' },
                { title: 'sidebar.selfPurchaseReplenish', url: '/purchase/self-purchase-replenish' },
                { title: 'sidebar.hqDistribution', url: '/purchase/hq-distribution' },
                { title: 'sidebar.requisitionTimeRule', url: '/purchase/requisition-time-rule' },
              ],
            },
            {
              title: 'sidebar.autoReplenish',
              items: [
                { title: 'sidebar.suggestReplenishConfig', url: '/purchase/suggest-replenish-config' },
                { title: 'sidebar.autoReplenishConfig', url: '/purchase/auto-replenish-config' },
                { title: 'sidebar.storeReplenishList', url: '/purchase/store-replenish-list' },
                { title: 'sidebar.dcReplenishList', url: '/purchase/dc-replenish-list' },
              ],
            },
          ],
        },
        // ==================== 3. 库存 Inventory ====================
        {
          title: 'sidebar.inventory',
          icon: PackageSearch,
          items: [
            {
              title: 'sidebar.storeReceiveReturn',
              items: [
                { title: 'sidebar.purchaseReceiptOrder', url: '/inventory/purchase-receipt-order' },
                { title: 'sidebar.deliveryReceiptOrder', url: '/inventory/delivery-receipt-order' },
                { title: 'sidebar.returnRequestOrder', url: '/inventory/return-request-order' },
                { title: 'sidebar.purchaseReturnOrder', url: '/inventory/purchase-return-order' },
                { title: 'sidebar.deliveryReturnRequestOrder', url: '/inventory/delivery-return-request-order' },
                { title: 'sidebar.deliveryReturnIssueOrder', url: '/inventory/delivery-return-issue-order' },
                { title: 'sidebar.deliveryReturnDiffOrder', url: '/inventory/delivery-return-diff-order' },
              ],
            },
            {
              title: 'sidebar.dcReceiveReturn',
              items: [
                { title: 'sidebar.dcPurchaseReceiptOrder', url: '/inventory/dc-purchase-receipt-order' },
                { title: 'sidebar.deliveryIssueOrder', url: '/inventory/delivery-issue-order' },
                { title: 'sidebar.deliveryDiffOrder', url: '/inventory/delivery-diff-order' },
                { title: 'sidebar.deliveryReturnReceiptOrder', url: '/inventory/delivery-return-receipt-order' },
                { title: 'sidebar.dcPurchaseReturnOrder', url: '/inventory/dc-purchase-return-order' },
              ],
            },
            {
              title: 'sidebar.stockManagement',
              items: [
                { title: 'sidebar.productStock', url: '/inventory/product-stock' },
                { title: 'sidebar.supplierProductStock', url: '/inventory/supplier-product-stock' },
                { title: 'sidebar.stockQuantityReport', url: '/inventory/stock-quantity-report' },
                { title: 'sidebar.stockCostReport', url: '/inventory/stock-cost-report' },
                { title: 'sidebar.batchStock', url: '/inventory/batch-stock' },
                { title: 'sidebar.productLedger', url: '/inventory/product-ledger' },
                { title: 'sidebar.batchLedger', url: '/inventory/batch-ledger' },
                { title: 'sidebar.purchaseSalesStockAnalysis', url: '/inventory/purchase-sales-stock-analysis' },
                { title: 'sidebar.stockIndicator', url: '/inventory/stock-indicator' },
                { title: 'sidebar.stockWarning', url: '/inventory/stock-warning' },
                { title: 'sidebar.expiryWarning', url: '/inventory/expiry-warning' },
                { title: 'sidebar.retailBatchIssueRule', url: '/inventory/retail-batch-issue-rule' },
                { title: 'sidebar.shelfStock', url: '/inventory/shelf-stock' },
                { title: 'sidebar.shelfStockFlow', url: '/inventory/shelf-stock-flow' },
                { title: 'sidebar.shelfAttributeStockReport', url: '/inventory/shelf-attribute-stock-report' },
              ],
            },
            {
              title: 'sidebar.transferOperation',
              items: [
                { title: 'sidebar.transferIssueOrder', url: '/inventory/transfer-issue-order' },
                { title: 'sidebar.transferReceiptOrder', url: '/inventory/transfer-receipt-order' },
                { title: 'sidebar.transferDiffOrder', url: '/inventory/transfer-diff-order' },
              ],
            },
            {
              title: 'sidebar.stockTakeOperation',
              items: [
                { title: 'sidebar.stockTakeOrder', url: '/inventory/stock-take-order' },
                { title: 'sidebar.stockTakeEntryOrder', url: '/inventory/stock-take-entry-order' },
                { title: 'sidebar.preStockTakeOrder', url: '/inventory/pre-stock-take-order' },
                { title: 'sidebar.expressStockTakeOrder', url: '/inventory/express-stock-take-order' },
              ],
            },
            {
              title: 'sidebar.pickingConfig',
              items: [
                { title: 'sidebar.warehouseCategoryManagement', url: '/inventory/warehouse-category-management' },
                { title: 'sidebar.deliverySiteQuery', url: '/inventory/delivery-site-query' },
              ],
            },
            {
              title: 'sidebar.inventoryReports',
              items: [
                { title: 'sidebar.purchaseReport', url: '/inventory/purchase-report' },
                { title: 'sidebar.deliveryReport', url: '/inventory/delivery-report' },
                { title: 'sidebar.requisitionReport', url: '/inventory/requisition-report' },
                { title: 'sidebar.warehouseTransferReport', url: '/inventory/warehouse-transfer-report' },
                { title: 'sidebar.stockAdjustReport', url: '/inventory/stock-adjust-report' },
                { title: 'sidebar.transferReport', url: '/inventory/transfer-report' },
                { title: 'sidebar.stockTakeReport', url: '/inventory/stock-take-report' },
                { title: 'sidebar.combineSplitReport', url: '/inventory/combine-split-report' },
                { title: 'sidebar.damageOverflowReasonReport', url: '/inventory/damage-overflow-reason-report' },
                { title: 'sidebar.acceptanceEfficiencyReport', url: '/inventory/acceptance-efficiency-report' },
                { title: 'sidebar.shelvingReport', url: '/inventory/shelving-report' },
              ],
            },
            {
              title: 'sidebar.otherOperations',
              items: [
                { title: 'sidebar.damageOrder', url: '/inventory/damage-order' },
                { title: 'sidebar.overflowOrder', url: '/inventory/overflow-order' },
                { title: 'sidebar.stockAdjustmentOrder', url: '/inventory/stock-adjustment-order' },
                { title: 'sidebar.requisitionOrder2', url: '/inventory/requisition-order' },
                { title: 'sidebar.warehouseTransferOrder', url: '/inventory/warehouse-transfer-order' },
                { title: 'sidebar.shelfTransferOrder', url: '/inventory/shelf-transfer-order' },
                { title: 'sidebar.combineSplitOrder', url: '/inventory/combine-split-order' },
              ],
            },
          ],
        },
        // ==================== 4. 配送 Distribution ====================
        {
          title: 'sidebar.distribution',
          icon: Truck,
          items: [
            {
              title: 'sidebar.pickingManagement',
              items: [
                { title: 'sidebar.pickingProcess', url: '/distribution/picking-process' },
                { title: 'sidebar.pickingTask', url: '/distribution/picking-task' },
              ],
            },
            {
              title: 'sidebar.distributionArchive',
              items: [
                { title: 'sidebar.dcZoneManagement', url: '/distribution/dc-zone-management' },
                { title: 'sidebar.dcShelfManagement', url: '/distribution/dc-shelf-management' },
                { title: 'sidebar.pickingSequence', url: '/distribution/picking-sequence' },
                { title: 'sidebar.dcShelfProductInfo', url: '/distribution/dc-shelf-product-info' },
              ],
            },
            {
              title: 'sidebar.vehicleDispatchMgmt',
              items: [
                { title: 'sidebar.vehicleManagement', url: '/distribution/vehicle-management' },
                { title: 'sidebar.driverManagement', url: '/distribution/driver-management' },
                { title: 'sidebar.dispatchOrder', url: '/distribution/dispatch-order' },
                { title: 'sidebar.routeManagement', url: '/distribution/route-management' },
              ],
            },
            {
              title: 'sidebar.dcProcurement',
              items: [
                { title: 'sidebar.turnoverManagement', url: '/distribution/turnover-management' },
                { title: 'sidebar.procurementComparison', url: '/distribution/procurement-comparison' },
              ],
            },
            {
              title: 'sidebar.distributionReports',
              items: [
                { title: 'sidebar.pickingDetailReport', url: '/distribution/picking-detail-report' },
                { title: 'sidebar.deliveryRateReport', url: '/distribution/delivery-rate-report' },
              ],
            },
          ],
        },
        // ==================== 5. 营运 Operation ====================
        {
          title: 'sidebar.operation',
          icon: ShoppingBag,
          items: [
            {
              title: 'sidebar.cashierManagement',
              items: [
                { title: 'sidebar.posDeviceManagement', url: '/operation/pos-device-management' },
                { title: 'sidebar.posFeeManagement', url: '/operation/pos-fee-management' },
                { title: 'sidebar.posExpenseManagement', url: '/operation/pos-expense-management' },
                { title: 'sidebar.salesOrder', url: '/operation/sales-order' },
                { title: 'sidebar.manualPaymentConfirmQuery', url: '/operation/manual-payment-confirm-query' },
                { title: 'sidebar.cashierPaymentOrder', url: '/operation/cashier-payment-order' },
              ],
            },
            {
              title: 'sidebar.scales',
              items: [
                { title: 'sidebar.scaleDeviceManagement', url: '/operation/scale-device-management' },
                { title: 'sidebar.autoScaleManagement', url: '/operation/auto-scale-management' },
                { title: 'sidebar.scaleProductPool', url: '/operation/scale-product-pool' },
              ],
            },
            {
              title: 'sidebar.priceTags',
              items: [
                { title: 'sidebar.priceTagPrint', url: '/operation/price-tag-print' },
                { title: 'sidebar.priceTagTemplate', url: '/operation/price-tag-template' },
              ],
            },
            {
              title: 'sidebar.deviceManagement',
              items: [
                { title: 'sidebar.deviceList', url: '/operation/device-list' },
              ],
            },
            {
              title: 'sidebar.afterSalesRefund',
              items: [
                { title: 'sidebar.afterSalesManagement', url: '/operation/after-sales-management' },
                { title: 'sidebar.refundManagement', url: '/operation/refund-management' },
                { title: 'sidebar.refundException', url: '/operation/refund-exception' },
              ],
            },
            {
              title: 'sidebar.mobileOffice',
              items: [
                { title: 'sidebar.cloudSteward', url: '/operation/cloud-steward' },
                { title: 'sidebar.dataQuickView', url: '/operation/data-quick-view' },
              ],
            },
            {
              title: 'sidebar.salesCommission',
              items: [
                { title: 'sidebar.commissionPlan', url: '/operation/commission-plan' },
                { title: 'sidebar.salesCommissionList', url: '/operation/sales-commission-list' },
              ],
            },
            {
              title: 'sidebar.paymentSection',
              items: [
                { title: 'sidebar.abnormalPaymentRefund', url: '/operation/abnormal-payment-refund' },
              ],
            },
            {
              title: 'sidebar.operationReports',
              items: [
                { title: 'sidebar.salesFlow', url: '/operation/sales-flow' },
                { title: 'sidebar.salesSummary', url: '/operation/sales-summary' },
                { title: 'sidebar.paymentFlow', url: '/operation/payment-flow' },
                { title: 'sidebar.collectionReconciliation', url: '/operation/collection-reconciliation' },
                { title: 'sidebar.jointSalesSummary', url: '/operation/joint-sales-summary' },
                { title: 'sidebar.cashierBehaviorReport', url: '/operation/cashier-behavior-report' },
                { title: 'sidebar.cashierShortageReport', url: '/operation/cashier-shortage-report' },
                { title: 'sidebar.posFeeDetailReport', url: '/operation/pos-fee-detail-report' },
                { title: 'sidebar.posExpenseDetailReport', url: '/operation/pos-expense-detail-report' },
                { title: 'sidebar.posPriceChangeReport', url: '/operation/pos-price-change-report' },
                { title: 'sidebar.misposOfflineReturnReport', url: '/operation/mispos-offline-return-report' },
                { title: 'sidebar.cashierShiftReport', url: '/operation/cashier-shift-report' },
                { title: 'sidebar.thirdPartyPaymentBill', url: '/operation/third-party-payment-bill' },
              ],
            },
          ],
        },
        // ==================== 6. 线上 Online ====================
        {
          title: 'sidebar.online',
          icon: Globe,
          items: [
            {
              title: 'sidebar.mallManagement',
              items: [
                { title: 'sidebar.wechatMiniApp', url: '/online/wechat-mini-app' },
                { title: 'sidebar.wechatOfficialAccount', url: '/online/wechat-official-account' },
                { title: 'sidebar.enterpriseWechat', url: '/online/enterprise-wechat' },
              ],
            },
            {
              title: 'sidebar.productPublish',
              items: [
                { title: 'sidebar.onlineProductManagement', url: '/online/online-product-management' },
                { title: 'sidebar.onlineStoreProductManagement', url: '/online/online-store-product-management' },
                { title: 'sidebar.onlineBusinessChangeOrder', url: '/online/online-business-change-order' },
                { title: 'sidebar.onlineAssortmentManagement', url: '/online/online-assortment-management' },
              ],
            },
            {
              title: 'sidebar.aggregatedTakeout',
              items: [
                { title: 'sidebar.accessGuide', url: '/online/access-guide' },
                { title: 'sidebar.generalConfig', url: '/online/general-config' },
                { title: 'sidebar.channelCategoryBinding', url: '/online/channel-category-binding' },
                { title: 'sidebar.douyinProductManagement', url: '/online/douyin-product-management' },
                { title: 'sidebar.syncProgressQuery', url: '/online/sync-progress-query' },
              ],
            },
          ],
        },
        // ==================== 7. 会员 Member ====================
        {
          title: 'sidebar.member',
          icon: UserCheck,
          items: [
            {
              title: 'sidebar.serviceDesk',
              items: [
                { title: 'sidebar.cardRecharge', url: '/member/card-recharge' },
                { title: 'sidebar.cardSales', url: '/member/card-sales' },
                { title: 'sidebar.cardQueryManagement', url: '/member/card-query-management' },
                { title: 'sidebar.addMember', url: '/member/add-member' },
              ],
            },
            {
              title: 'sidebar.physicalCardManagement',
              items: [
                { title: 'sidebar.cardReaderConfig', url: '/member/card-reader-config' },
                { title: 'sidebar.batchCreateCard', url: '/member/batch-create-card' },
                { title: 'sidebar.batchWriteCard', url: '/member/batch-write-card' },
                { title: 'sidebar.cardDetail', url: '/member/card-detail' },
                { title: 'sidebar.physicalCardLog', url: '/member/physical-card-log' },
              ],
            },
            {
              title: 'sidebar.memberManagement',
              items: [
                { title: 'sidebar.memberInfoManagement', url: '/member/member-info-management' },
                { title: 'sidebar.memberCategoryManagement', url: '/member/member-category-management' },
                { title: 'sidebar.memberDiscountManagement', url: '/member/member-discount-management' },
                { title: 'sidebar.wechatMemberCardConfig', url: '/member/wechat-member-card-config' },
              ],
            },
            {
              title: 'sidebar.cardBusiness',
              items: [
                { title: 'sidebar.cardRechargeSalesManagement', url: '/member/card-recharge-sales-management' },
                { title: 'sidebar.memberBatchRecharge', url: '/member/member-batch-recharge' },
                { title: 'sidebar.storedCardBatchRecharge', url: '/member/stored-card-batch-recharge' },
                { title: 'sidebar.groupBuyingVoucher', url: '/member/group-buying-voucher' },
                { title: 'sidebar.cardAfterSalesManagement', url: '/member/card-after-sales-management' },
                { title: 'sidebar.groupBuyingCustomerManagement', url: '/member/group-buying-customer-management' },
                { title: 'sidebar.rechargeDiscountRuleManagement', url: '/member/recharge-discount-rule-management' },
              ],
            },
            {
              title: 'sidebar.pointsManagement',
              items: [
                { title: 'sidebar.pointsRuleManagement', url: '/member/points-rule-management' },
                { title: 'sidebar.pointsAdjustment', url: '/member/points-adjustment' },
                { title: 'sidebar.pointsChangeDetail', url: '/member/points-change-detail' },
                { title: 'sidebar.pointsProductConfig', url: '/member/points-product-config' },
                { title: 'sidebar.pointsProductExchange', url: '/member/points-product-exchange' },
                { title: 'sidebar.pointsClearRule', url: '/member/points-clear-rule' },
              ],
            },
            {
              title: 'sidebar.memberReports',
              items: [
                { title: 'sidebar.walletFlowReport', url: '/member/wallet-flow-report' },
                { title: 'sidebar.balanceRechargeConsumptionReport', url: '/member/balance-recharge-consumption-report' },
                { title: 'sidebar.storedCardReport', url: '/member/stored-card-report' },
                { title: 'sidebar.voucherSalesConsumptionReport', url: '/member/voucher-sales-consumption-report' },
                { title: 'sidebar.cardBalanceDetailQuery', url: '/member/card-balance-detail-query' },
                { title: 'sidebar.memberBalanceDetailQuery', url: '/member/member-balance-detail-query' },
                { title: 'sidebar.merchantBalanceSummary', url: '/member/merchant-balance-summary' },
                { title: 'sidebar.pointsReport', url: '/member/points-report' },
                { title: 'sidebar.memberBalancePeriodDetailReport', url: '/member/member-balance-period-detail-report' },
              ],
            },
          ],
        },
        // ==================== 8. 营销 Marketing ====================
        {
          title: 'sidebar.marketing',
          icon: Megaphone,
          items: [
            {
              title: 'sidebar.couponManagement',
              items: [
                { title: 'sidebar.couponBatchManagement', url: '/marketing/coupon-batch-management' },
                { title: 'sidebar.couponReissueDetail', url: '/marketing/coupon-reissue-detail' },
              ],
            },
            {
              title: 'sidebar.promotionTools',
              items: [
                { title: 'sidebar.marketingToolset', url: '/marketing/marketing-toolset' },
                { title: 'sidebar.promotionActivity', url: '/marketing/promotion-activity' },
                { title: 'sidebar.promotionTerminationOrder', url: '/marketing/promotion-termination-order' },
                { title: 'sidebar.scheduledPromotionOrder', url: '/marketing/scheduled-promotion-order' },
                { title: 'sidebar.scheduledPromotionTerminationOrder', url: '/marketing/scheduled-promotion-termination-order' },
                { title: 'sidebar.discountCode', url: '/marketing/discount-code' },
                { title: 'sidebar.discountPriceTag', url: '/marketing/discount-price-tag' },
              ],
            },
            {
              title: 'sidebar.marketingReports',
              items: [
                { title: 'sidebar.promotionActivityReport', url: '/marketing/promotion-activity-report' },
                { title: 'sidebar.scheduledPromotionReport', url: '/marketing/scheduled-promotion-report' },
                { title: 'sidebar.discountCodeDetailReport', url: '/marketing/discount-code-detail-report' },
                { title: 'sidebar.couponCodeDetailReport', url: '/marketing/coupon-code-detail-report' },
              ],
            },
          ],
        },
        // ==================== 9. 批发 Wholesale ====================
        {
          title: 'sidebar.wholesale',
          icon: Building2,
          items: [
            {
              title: 'sidebar.customerManagement',
              items: [
                { title: 'sidebar.customerRegionArchive', url: '/wholesale/customer-region-archive' },
                { title: 'sidebar.customerArchive', url: '/wholesale/customer-archive' },
              ],
            },
            {
              title: 'sidebar.customerPricing',
              items: [
                { title: 'sidebar.wholesalePriceAdjust', url: '/wholesale/wholesale-price-adjust' },
                { title: 'sidebar.customerExclusivePrice', url: '/wholesale/customer-exclusive-price' },
                { title: 'sidebar.wholesaleTierPrice', url: '/wholesale/wholesale-tier-price' },
                { title: 'sidebar.quotationOrder', url: '/wholesale/quotation-order' },
                { title: 'sidebar.customerPriceQuery', url: '/wholesale/customer-price-query' },
              ],
            },
            {
              title: 'sidebar.wholesaleSales',
              items: [
                { title: 'sidebar.wholesaleOrder', url: '/wholesale/wholesale-order' },
                { title: 'sidebar.wholesaleSalesOrder', url: '/wholesale/wholesale-sales-order' },
                { title: 'sidebar.wholesaleReturnOrder', url: '/wholesale/wholesale-return-order' },
              ],
            },
            {
              title: 'sidebar.wholesaleMiniApp',
              items: [
                { title: 'sidebar.wholesaleMiniAppAuth', url: '/wholesale/wholesale-mini-app-auth' },
                { title: 'sidebar.wholesaleMiniAppConfig', url: '/wholesale/wholesale-mini-app-config' },
              ],
            },
            {
              title: 'sidebar.wholesaleReports',
              items: [
                { title: 'sidebar.wholesaleSalesReport', url: '/wholesale/wholesale-sales-report' },
                { title: 'sidebar.wholesaleOrderReport', url: '/wholesale/wholesale-order-report' },
                { title: 'sidebar.wholesaleOrderSalesReport', url: '/wholesale/wholesale-order-sales-report' },
              ],
            },
          ],
        },
        // ==================== 10. 加盟 Franchise ====================
        {
          title: 'sidebar.franchise',
          icon: Handshake,
          items: [
            {
              title: 'sidebar.franchiseeManagement',
              items: [
                { title: 'sidebar.franchiseeArchive', url: '/franchise/franchisee-archive' },
              ],
            },
            {
              title: 'sidebar.franchiseeSettlement',
              items: [
                { title: 'sidebar.franchiseePrepaymentOrder', url: '/franchise/franchisee-prepayment-order' },
                { title: 'sidebar.franchiseePrepaymentQuery', url: '/franchise/franchisee-prepayment-query' },
                { title: 'sidebar.franchiseeFeeOrder', url: '/franchise/franchisee-fee-order' },
                { title: 'sidebar.franchiseeSettlementBizOrder', url: '/franchise/franchisee-settlement-biz-order' },
                { title: 'sidebar.franchiseeSettlementOrder', url: '/franchise/franchisee-settlement-order' },
                { title: 'sidebar.franchiseeTransactionQuery', url: '/franchise/franchisee-transaction-query' },
                { title: 'sidebar.franchiseeTransactionSummaryQuery', url: '/franchise/franchisee-transaction-summary-query' },
              ],
            },
          ],
        },
        // ==================== 11. 财务 Finance ====================
        {
          title: 'sidebar.finance',
          icon: Wallet,
          items: [
            {
              title: 'sidebar.supplierSettlement',
              items: [
                { title: 'sidebar.supplierSettlementOrder', url: '/finance/supplier-settlement-order' },
                { title: 'sidebar.supplierPaymentOrder', url: '/finance/supplier-payment-order' },
                { title: 'sidebar.supplierPrepaymentOrder', url: '/finance/supplier-prepayment-order' },
                { title: 'sidebar.supplierOpeningBalance', url: '/finance/supplier-opening-balance' },
                { title: 'sidebar.purchaseBizOrder', url: '/finance/purchase-biz-order' },
                { title: 'sidebar.supplierPayableSummary', url: '/finance/supplier-payable-summary' },
                { title: 'sidebar.supplierTransactionQuery', url: '/finance/supplier-transaction-query' },
                { title: 'sidebar.supplierDocumentDetail', url: '/finance/supplier-document-detail' },
                { title: 'sidebar.settlementGroup', url: '/finance/settlement-group' },
                { title: 'sidebar.actualSalesDiffSummary', url: '/finance/actual-sales-diff-summary' },
                { title: 'sidebar.actualSalesDiffDetail', url: '/finance/actual-sales-diff-detail' },
                { title: 'sidebar.supplierBatchSettlement', url: '/finance/supplier-batch-settlement' },
              ],
            },
            {
              title: 'sidebar.wholesaleSettlement',
              items: [
                { title: 'sidebar.customerOpeningBalance', url: '/finance/customer-opening-balance' },
                { title: 'sidebar.customerPrepaymentOrder', url: '/finance/customer-prepayment-order' },
                { title: 'sidebar.customerFeeOrder', url: '/finance/customer-fee-order' },
                { title: 'sidebar.customerReceiptOrder', url: '/finance/customer-receipt-order' },
                { title: 'sidebar.customerReceivableSummary', url: '/finance/customer-receivable-summary' },
                { title: 'sidebar.customerTransactionQuery', url: '/finance/customer-transaction-query' },
                { title: 'sidebar.customerDocumentDetail', url: '/finance/customer-document-detail' },
              ],
            },
            {
              title: 'sidebar.orgSettlement',
              items: [
                { title: 'sidebar.orgGrouping', url: '/finance/org-grouping' },
                { title: 'sidebar.orgSettlementOrder', url: '/finance/org-settlement-order' },
              ],
            },
            {
              title: 'sidebar.supplierFees',
              items: [
                { title: 'sidebar.manualFeeOrder', url: '/finance/manual-fee-order' },
                { title: 'sidebar.promoDiffOrder', url: '/finance/promo-diff-order' },
                { title: 'sidebar.rebateFeeQuery', url: '/finance/rebate-fee-query' },
                { title: 'sidebar.rebateFeeDetail', url: '/finance/rebate-fee-detail' },
                { title: 'sidebar.jointCostQuery', url: '/finance/joint-cost-query' },
                { title: 'sidebar.jointCostDetail', url: '/finance/joint-cost-detail' },
              ],
            },
            {
              title: 'sidebar.voucherConfig',
              items: [
                { title: 'sidebar.entityInfo', url: '/finance/entity-info' },
                { title: 'sidebar.accountInfo', url: '/finance/account-info' },
                { title: 'sidebar.voucherGenerationPlan', url: '/finance/voucher-generation-plan' },
              ],
            },
            {
              title: 'sidebar.voucherManagement',
              items: [
                { title: 'sidebar.generalLedgerVoucherQuery', url: '/finance/general-ledger-voucher-query' },
                { title: 'sidebar.bizVoucherQuery', url: '/finance/biz-voucher-query' },
                { title: 'sidebar.manualVoucher', url: '/finance/manual-voucher' },
                { title: 'sidebar.voucherGenerationQuery', url: '/finance/voucher-generation-query' },
              ],
            },
            {
              title: 'sidebar.financeGuide',
              items: [
                { title: 'sidebar.inventoryManagementFlow', url: '/finance/inventory-management-flow' },
                { title: 'sidebar.settlementFlowGuide', url: '/finance/settlement-flow-guide' },
              ],
            },
          ],
        },
        // ==================== 12. 数据 Analytics ====================
        {
          title: 'sidebar.analytics',
          icon: LineChart,
          items: [
            {
              title: 'sidebar.storeSalesReports',
              items: [
                { title: 'sidebar.storeDailyReport', url: '/analytics/store-daily-report' },
                { title: 'sidebar.storeTodaySales', url: '/analytics/store-today-sales' },
                { title: 'sidebar.storeProductSales', url: '/analytics/store-product-sales' },
                { title: 'sidebar.storeSupplierSales', url: '/analytics/store-supplier-sales' },
                { title: 'sidebar.storeSalesSummary', url: '/analytics/store-sales-summary' },
                { title: 'sidebar.storeCategorySalesSummary', url: '/analytics/store-category-sales-summary' },
                { title: 'sidebar.storeProductSalesSummary', url: '/analytics/store-product-sales-summary' },
                { title: 'sidebar.salesProfitAnalysis', url: '/analytics/sales-profit-analysis' },
                { title: 'sidebar.salesComparisonAnalysis', url: '/analytics/sales-comparison-analysis' },
                { title: 'sidebar.omniChannelSalesReport', url: '/analytics/omni-channel-sales-report' },
                { title: 'sidebar.onlineSalesReport', url: '/analytics/online-sales-report' },
                { title: 'sidebar.customerFlowAnalysis', url: '/analytics/customer-flow-analysis' },
                { title: 'sidebar.avgOrderAnalysis', url: '/analytics/avg-order-analysis' },
                { title: 'sidebar.sellThroughAnalysis', url: '/analytics/sell-through-analysis' },
                { title: 'sidebar.taxRateSalesSummary', url: '/analytics/tax-rate-sales-summary' },
                { title: 'sidebar.multiPackageSales', url: '/analytics/multi-package-sales' },
                { title: 'sidebar.shelfSales', url: '/analytics/shelf-sales' },
                { title: 'sidebar.multiBarcodeSales', url: '/analytics/multi-barcode-sales' },
              ],
            },
            {
              title: 'sidebar.productAnalysis',
              items: [
                { title: 'sidebar.productSevenAnomalies', url: '/analytics/product-seven-anomalies' },
                { title: 'sidebar.productStockReport', url: '/analytics/product-stock-report' },
                { title: 'sidebar.productLossReport', url: '/analytics/product-loss-report' },
                { title: 'sidebar.productAbcAnalysis', url: '/analytics/product-abc-analysis' },
                { title: 'sidebar.priceBandAnalysis', url: '/analytics/price-band-analysis' },
                { title: 'sidebar.categoryItemStats', url: '/analytics/category-item-stats' },
                { title: 'sidebar.realtimeBomSales', url: '/analytics/realtime-bom-sales' },
                { title: 'sidebar.productBatchSales', url: '/analytics/product-batch-sales' },
                { title: 'sidebar.newProductSalesReport', url: '/analytics/new-product-sales-report' },
                { title: 'sidebar.productDeptSales', url: '/analytics/product-dept-sales' },
              ],
            },
            {
              title: 'sidebar.supplierAnalytics',
              items: [
                { title: 'sidebar.supplierSalesReport', url: '/analytics/supplier-sales-report' },
                { title: 'sidebar.supplierPaymentSummary', url: '/analytics/supplier-payment-summary' },
                { title: 'sidebar.supplierMonthlyReport', url: '/analytics/supplier-monthly-report' },
                { title: 'sidebar.supplierProductSalesDetail', url: '/analytics/supplier-product-sales-detail' },
              ],
            },
            {
              title: 'sidebar.freshReports',
              items: [
                { title: 'sidebar.freshOperationOverview', url: '/analytics/fresh-operation-overview' },
                { title: 'sidebar.freshLossSummary', url: '/analytics/fresh-loss-summary' },
                { title: 'sidebar.dailyClearProductProfit', url: '/analytics/daily-clear-product-profit' },
                { title: 'sidebar.gradedProductSales', url: '/analytics/graded-product-sales' },
              ],
            },
            {
              title: 'sidebar.operationAnalysis',
              items: [
                { title: 'sidebar.storeEfficiency', url: '/analytics/store-efficiency' },
                { title: 'sidebar.storeCashierEfficiency', url: '/analytics/store-cashier-efficiency' },
                { title: 'sidebar.clerkPerformanceSummary', url: '/analytics/clerk-performance-summary' },
              ],
            },
            {
              title: 'sidebar.digitalScreen',
              items: [
                { title: 'sidebar.hqScreen', url: '/analytics/hq-screen' },
                { title: 'sidebar.storeScreen', url: '/analytics/store-screen' },
              ],
            },
            {
              title: 'sidebar.budgetManagement',
              items: [
                { title: 'sidebar.budgetEntry', url: '/analytics/budget-entry' },
                { title: 'sidebar.budgetView', url: '/analytics/budget-view' },
                { title: 'sidebar.budgetAchievement', url: '/analytics/budget-achievement' },
              ],
            },
            {
              title: 'sidebar.warehouseLogisticsReports',
              items: [
                { title: 'sidebar.deliveryIssueAnalysis', url: '/analytics/delivery-issue-analysis' },
                { title: 'sidebar.warehouseStockReport', url: '/analytics/warehouse-stock-report' },
              ],
            },
            {
              title: 'sidebar.marketingAnalytics',
              items: [
                { title: 'sidebar.realtimePromotionReport', url: '/analytics/realtime-promotion-report' },
                { title: 'sidebar.categoryPromotionReport', url: '/analytics/category-promotion-report' },
                { title: 'sidebar.productPromotionReport', url: '/analytics/product-promotion-report' },
                { title: 'sidebar.promotionPerformanceComparison', url: '/analytics/promotion-performance-comparison' },
                { title: 'sidebar.promotionActivityAnalysis', url: '/analytics/promotion-activity-analysis' },
                { title: 'sidebar.memberAssetSummary', url: '/analytics/member-asset-summary' },
                { title: 'sidebar.storeMemberSales', url: '/analytics/store-member-sales' },
                { title: 'sidebar.storeCouponAnalysis', url: '/analytics/store-coupon-analysis' },
                { title: 'sidebar.productCouponAnalysis', url: '/analytics/product-coupon-analysis' },
                { title: 'sidebar.scheduledProductSales', url: '/analytics/scheduled-product-sales' },
              ],
            },
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

export const sidebarUser = sidebarData.user
export const sidebarTeams = sidebarData.teams
export const tenantFallbackNavGroups = sidebarData.navGroups
