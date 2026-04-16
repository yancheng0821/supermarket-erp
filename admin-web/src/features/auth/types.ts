export type LoginScope = 'platform' | 'tenant'

export interface AuthUser {
  userId: number
  username: string
  nickname: string
}

export interface AuthTenant {
  tenantId: number
  tenantCode: string
  tenantName: string
}

export interface AuthMenuItem {
  id: number
  name: string
  path: string
  component: string | null
  icon: string | null
  permission: string | null
  children: AuthMenuItem[]
}

export interface LoginResponse {
  token: string
  userId: number
  nickname: string
  loginScope: LoginScope
}

export interface PlatformLoginRequest {
  username: string
  password: string
}

export interface TenantLoginRequest extends PlatformLoginRequest {
  tenantCode: string
}

export interface AuthSessionResponse {
  loginScope: LoginScope
  user: AuthUser
  tenant: AuthTenant | null
  permissions: string[]
  menuTree: AuthMenuItem[]
}

export interface AuthSessionSnapshot extends AuthSessionResponse {
  token: string
}
