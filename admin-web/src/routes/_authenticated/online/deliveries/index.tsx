import { createFileRoute } from '@tanstack/react-router'
import { DeliveryOrdersPage } from '@/features/online/deliveries'

export const Route = createFileRoute('/_authenticated/online/deliveries/')({
  component: DeliveryOrdersPage,
})
