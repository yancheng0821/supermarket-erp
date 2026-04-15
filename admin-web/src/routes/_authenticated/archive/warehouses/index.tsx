import { createFileRoute } from '@tanstack/react-router'
import { WarehousesPage } from '@/features/archive/warehouses'

export const Route = createFileRoute('/_authenticated/archive/warehouses/')({
  component: WarehousesPage,
})
