import { createFileRoute } from '@tanstack/react-router'
import { PaymentsPage } from '@/features/operation/payments'

export const Route = createFileRoute('/_authenticated/operation/payments/')({
  component: PaymentsPage,
})
