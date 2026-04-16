import { bootstrapSession } from './session-bootstrap'

type RedirectLocation = {
  href: string
  pathname: string
}

export async function resolveAuthenticatedRedirect(location: RedirectLocation) {
  const session = await bootstrapSession()

  if (!session) {
    return {
      to: '/sign-in',
      search: { redirect: location.href },
      replace: true,
    } as const
  }

  if (session.loginScope === 'platform') {
    if (location.pathname === '/' || !location.pathname.startsWith('/platform')) {
      return {
        to: '/platform/tenants',
        replace: true,
      } as const
    }
  }

  if (
    session.loginScope === 'tenant' &&
    location.pathname.startsWith('/platform')
  ) {
    return {
      to: '/',
      replace: true,
    } as const
  }

  return null
}
