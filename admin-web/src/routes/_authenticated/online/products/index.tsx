import { createFileRoute } from '@tanstack/react-router'
import { OnlineProductsPage } from '@/features/online/products'

export const Route = createFileRoute('/_authenticated/online/products/')({
  component: OnlineProductsPage,
})
