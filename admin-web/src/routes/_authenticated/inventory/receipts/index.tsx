import { createFileRoute } from '@tanstack/react-router'
import { ReceiptOrdersPage } from '@/features/inventory/receipts'

export const Route = createFileRoute('/_authenticated/inventory/receipts/')({
  component: ReceiptOrdersPage,
})
