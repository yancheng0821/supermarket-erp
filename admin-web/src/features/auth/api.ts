import { api } from '@/lib/api'
import type {
  AuthMenuItem,
  AuthSessionResponse,
  LoginResponse,
  PlatformLoginRequest,
  TenantLoginRequest,
} from './types'

type BackendAuthSessionResponse = Omit<AuthSessionResponse, 'menuTree'> & {
  menus: AuthMenuItem[]
}

export function platformLogin(payload: PlatformLoginRequest) {
  return api.post<LoginResponse>('/admin/auth/platform-login', payload)
}

export function tenantLogin(payload: TenantLoginRequest) {
  return api.post<LoginResponse>('/admin/auth/tenant-login', payload)
}

export async function fetchAuthSession() {
  const session = await api.get<BackendAuthSessionResponse>('/admin/auth/session')
  return {
    loginScope: session.loginScope,
    user: session.user,
    tenant: session.tenant ?? null,
    permissions: session.permissions ?? [],
    menuTree: session.menus ?? [],
  } satisfies AuthSessionResponse
}
