import { createFileRoute } from '@tanstack/react-router'
import { SupplierSettlementPage } from '@/features/finance/supplier-settlement'

export const Route = createFileRoute('/_authenticated/finance/supplier-settlement/')({
  component: SupplierSettlementPage,
})
