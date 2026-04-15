import { createFileRoute } from '@tanstack/react-router'
import { CashierShiftsPage } from '@/features/operation/cashier-shifts'

export const Route = createFileRoute('/_authenticated/operation/cashier-shifts/')({
  component: CashierShiftsPage,
})
