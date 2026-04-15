import { createFileRoute } from '@tanstack/react-router'
import { ProductsPage } from '@/features/archive/products'

export const Route = createFileRoute('/_authenticated/archive/products/')({
  component: ProductsPage,
})
