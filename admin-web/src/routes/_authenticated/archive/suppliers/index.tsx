import { createFileRoute } from '@tanstack/react-router'
import { SuppliersPage } from '@/features/archive/suppliers'

export const Route = createFileRoute('/_authenticated/archive/suppliers/')({
  component: SuppliersPage,
})
