import { createFileRoute } from '@tanstack/react-router'
import { ReplenishPlansPage } from '@/features/purchase/replenish'

export const Route = createFileRoute('/_authenticated/purchase/replenish/')({
  component: ReplenishPlansPage,
})
