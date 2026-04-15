import { createFileRoute } from '@tanstack/react-router'
import { RefundsPage } from '@/features/operation/refunds'

export const Route = createFileRoute('/_authenticated/operation/refunds/')({
  component: RefundsPage,
})
