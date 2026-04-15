import { createFileRoute } from '@tanstack/react-router'
import { FeeRecordsPage } from '@/features/finance/fees'

export const Route = createFileRoute('/_authenticated/finance/fees/')({
  component: FeeRecordsPage,
})
