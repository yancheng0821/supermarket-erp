import { createFileRoute } from '@tanstack/react-router'
import { SalesOrdersPage } from '@/features/operation/sales'

export const Route = createFileRoute('/_authenticated/operation/sales/')({
  component: SalesOrdersPage,
})
