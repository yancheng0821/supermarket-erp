import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/lib/api'
import { fetchAuthSession } from '@/features/auth/api'
import { resolveAuthenticatedRedirect } from '@/features/auth/route-guard'
import {
  bootstrapSession,
  resetSessionBootstrap,
} from '@/features/auth/session-bootstrap'
import type { AuthSessionResponse } from '@/features/auth/types'
import { useAuthStore } from '@/stores/auth-store'

vi.mock('@/features/auth/api', () => ({
  fetchAuthSession: vi.fn(),
}))

const mockedFetchAuthSession = vi.mocked(fetchAuthSession)

const tenantSession: AuthSessionResponse = {
  loginScope: 'tenant',
  user: {
    userId: 1,
    username: 'admin',
    nickname: 'Tenant Admin',
  },
  tenant: {
    tenantId: 1,
    tenantCode: 'freshmart-sh',
    tenantName: 'Freshmart Shanghai',
  },
  permissions: ['system:user:page'],
  menuTree: [
    {
      id: 101,
      name: 'System',
      path: '/system',
      component: 'layout/router-view',
      icon: 'settings',
      permission: null,
      children: [],
    },
  ],
}

const platformSession: AuthSessionResponse = {
  loginScope: 'platform',
  user: {
    userId: 99,
    username: 'platform-admin',
    nickname: 'Platform Admin',
  },
  tenant: null,
  permissions: ['platform:tenant:page'],
  menuTree: [
    {
      id: 1,
      name: 'Platform',
      path: '/platform',
      component: 'layout/router-view',
      icon: 'building',
      permission: null,
      children: [],
    },
  ],
}

describe('authenticated route session bootstrap', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.getState().reset()
    resetSessionBootstrap()
    mockedFetchAuthSession.mockReset()
  })

  it('restores a persisted token by fetching the current session', async () => {
    useAuthStore.getState().setToken('tenant-token')
    mockedFetchAuthSession.mockResolvedValue(tenantSession)

    const restored = await bootstrapSession()

    expect(restored).toEqual(tenantSession)
    expect(mockedFetchAuthSession).toHaveBeenCalledTimes(1)
    expect(useAuthStore.getState().token).toBe('tenant-token')
    expect(useAuthStore.getState().loginScope).toBe('tenant')
    expect(useAuthStore.getState().tenant?.tenantCode).toBe('freshmart-sh')
  })

  it('resets the auth store when bootstrap receives a 401', async () => {
    useAuthStore.getState().setToken('expired-token')
    mockedFetchAuthSession.mockRejectedValue(
      new ApiError(401, 401, 'Unauthorized')
    )

    const restored = await bootstrapSession()

    expect(restored).toBeNull()
    expect(useAuthStore.getState().token).toBe('')
    expect(useAuthStore.getState().loginScope).toBeNull()
    expect(useAuthStore.getState().permissions).toEqual([])
  })
})

describe('authenticated route guard', () => {
  beforeEach(() => {
    localStorage.clear()
    useAuthStore.getState().reset()
    resetSessionBootstrap()
    mockedFetchAuthSession.mockReset()
  })

  it('redirects unauthenticated access to sign-in with the current location', async () => {
    await expect(
      resolveAuthenticatedRedirect({
        href: 'http://localhost/online/products',
        pathname: '/online/products',
      })
    ).resolves.toEqual({
      to: '/sign-in',
      search: { redirect: 'http://localhost/online/products' },
      replace: true,
    })
  })

  it('redirects platform sessions to the platform home when visiting root', async () => {
    useAuthStore.getState().setSessionSnapshot({
      token: 'platform-token',
      ...platformSession,
    })

    await expect(
      resolveAuthenticatedRedirect({
        href: 'http://localhost/',
        pathname: '/',
      })
    ).resolves.toEqual({
      to: '/platform/tenants',
      replace: true,
    })
  })

  it('blocks tenant sessions from platform routes', async () => {
    useAuthStore.getState().setSessionSnapshot({
      token: 'tenant-token',
      ...tenantSession,
    })

    await expect(
      resolveAuthenticatedRedirect({
        href: 'http://localhost/platform/tenants',
        pathname: '/platform/tenants',
      })
    ).resolves.toEqual({
      to: '/',
      replace: true,
    })
  })
})
