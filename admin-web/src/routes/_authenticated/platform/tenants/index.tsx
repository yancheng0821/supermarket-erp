import { createFileRoute } from '@tanstack/react-router'
import { PlatformTenantsPage } from '@/features/platform/tenants'

export const Route = createFileRoute('/_authenticated/platform/tenants/')({
  component: PlatformTenantsPage,
})
