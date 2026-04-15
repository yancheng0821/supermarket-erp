import { createFileRoute } from '@tanstack/react-router'
import { VouchersPage } from '@/features/finance/vouchers'

export const Route = createFileRoute('/_authenticated/finance/vouchers/')({
  component: VouchersPage,
})
