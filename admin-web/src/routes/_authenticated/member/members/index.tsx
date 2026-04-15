import { createFileRoute } from '@tanstack/react-router'
import { MembersPage } from '@/features/member/members'

export const Route = createFileRoute('/_authenticated/member/members/')({
  component: MembersPage,
})
