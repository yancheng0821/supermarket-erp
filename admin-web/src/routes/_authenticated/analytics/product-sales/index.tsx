import { createFileRoute } from '@tanstack/react-router'
import { ProductSalesPage } from '@/features/analytics/product-sales'

export const Route = createFileRoute('/_authenticated/analytics/product-sales/')({
  component: ProductSalesPage,
})
