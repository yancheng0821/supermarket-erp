import { createFileRoute } from '@tanstack/react-router'
import { StoresPage } from '@/features/archive/stores'

export const Route = createFileRoute('/_authenticated/archive/stores/')({
  component: StoresPage,
})
