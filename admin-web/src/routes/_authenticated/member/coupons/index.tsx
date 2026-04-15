import { createFileRoute } from '@tanstack/react-router'
import { CouponsPage } from '@/features/member/coupons'

export const Route = createFileRoute('/_authenticated/member/coupons/')({
  component: CouponsPage,
})
