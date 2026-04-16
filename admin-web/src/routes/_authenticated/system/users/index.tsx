import { createFileRoute } from '@tanstack/react-router'
import { SystemUsersPage } from '@/features/system/users'

export const Route = createFileRoute('/_authenticated/system/users/')({
  component: SystemUsersPage,
})
