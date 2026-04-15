import { createFileRoute } from '@tanstack/react-router'
import { TransfersPage } from '@/features/inventory/transfers'

export const Route = createFileRoute('/_authenticated/inventory/transfers/')({
  component: TransfersPage,
})
