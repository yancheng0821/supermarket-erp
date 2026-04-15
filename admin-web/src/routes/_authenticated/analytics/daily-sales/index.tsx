import { createFileRoute } from '@tanstack/react-router'
import { DailySalesPage } from '@/features/analytics/daily-sales'

export const Route = createFileRoute('/_authenticated/analytics/daily-sales/')({
  component: DailySalesPage,
})
