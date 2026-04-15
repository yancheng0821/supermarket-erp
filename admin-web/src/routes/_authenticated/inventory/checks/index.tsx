import { createFileRoute } from '@tanstack/react-router'
import { StockTakesPage } from '@/features/inventory/checks'

export const Route = createFileRoute('/_authenticated/inventory/checks/')({
  component: StockTakesPage,
})
