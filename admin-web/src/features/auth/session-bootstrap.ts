import { fetchAuthSession } from '@/features/auth/api'
import type { AuthSessionResponse } from '@/features/auth/types'
import { ApiError } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'

let bootstrapPromise: Promise<AuthSessionResponse | null> | null = null

export async function bootstrapSession(force = false) {
  const auth = useAuthStore.getState()

  if (!auth.token) {
    auth.setRestoreStatus('ready')
    return null
  }

  if (!force && auth.restoreStatus === 'ready' && auth.loginScope && auth.user) {
    return {
      loginScope: auth.loginScope,
      user: auth.user,
      tenant: auth.tenant,
      permissions: auth.permissions,
      menuTree: auth.menuTree,
    }
  }

  if (!force && bootstrapPromise) {
    return bootstrapPromise
  }

  auth.setRestoreStatus('loading')
  bootstrapPromise = fetchAuthSession()
    .then((session) => {
      useAuthStore.getState().setSession(session)
      return session
    })
    .catch((error) => {
      if (error instanceof ApiError && error.status === 401) {
        useAuthStore.getState().reset()
        return null
      }
      throw error
    })
    .finally(() => {
      useAuthStore.getState().setRestoreStatus('ready')
      bootstrapPromise = null
    })

  return bootstrapPromise
}

export function resetSessionBootstrap() {
  bootstrapPromise = null
}
