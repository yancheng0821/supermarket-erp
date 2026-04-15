import { createFileRoute } from '@tanstack/react-router'
import { StockOverviewPage } from '@/features/inventory/stock'

export const Route = createFileRoute('/_authenticated/inventory/stock/')({
  component: StockOverviewPage,
})
