import { createFileRoute } from '@tanstack/react-router'
import { InventorySnapshotPage } from '@/features/analytics/inventory'

export const Route = createFileRoute('/_authenticated/analytics/inventory/')({
  component: InventorySnapshotPage,
})
