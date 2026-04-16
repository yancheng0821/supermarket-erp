import { createFileRoute, redirect } from '@tanstack/react-router'
import { resolveAuthenticatedRedirect } from '@/features/auth/route-guard'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const nextRedirect = await resolveAuthenticatedRedirect({
      href: location.href,
      pathname: location.pathname,
    })

    if (nextRedirect) {
      throw redirect(nextRedirect)
    }
  },
  component: AuthenticatedLayout,
})
