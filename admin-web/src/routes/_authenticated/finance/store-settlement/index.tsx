import { createFileRoute } from '@tanstack/react-router'
import { StoreSettlementPage } from '@/features/finance/store-settlement'

export const Route = createFileRoute('/_authenticated/finance/store-settlement/')({
  component: StoreSettlementPage,
})
