import { createFileRoute } from '@tanstack/react-router'
import { StoreConfigPage } from '@/features/online/store-config'

export const Route = createFileRoute('/_authenticated/online/store-config/')({
  component: StoreConfigPage,
})
