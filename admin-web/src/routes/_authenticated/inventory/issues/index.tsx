import { createFileRoute } from '@tanstack/react-router'
import { IssueOrdersPage } from '@/features/inventory/issues'

export const Route = createFileRoute('/_authenticated/inventory/issues/')({
  component: IssueOrdersPage,
})
