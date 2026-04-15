import { createFileRoute } from '@tanstack/react-router'
import { PointsLogPage } from '@/features/member/points'

export const Route = createFileRoute('/_authenticated/member/points/')({
  component: PointsLogPage,
})
