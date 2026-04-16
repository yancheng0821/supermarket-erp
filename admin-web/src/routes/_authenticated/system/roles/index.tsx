import { createFileRoute } from '@tanstack/react-router'
import { SystemRolesPage } from '@/features/system/roles'

export const Route = createFileRoute('/_authenticated/system/roles/')({
  component: SystemRolesPage,
})
