import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type {
  AuthSessionResponse,
  AuthSessionSnapshot,
  LoginScope,
} from '@/features/auth/types'

export const AUTH_STORAGE_KEY = 'erp-auth-session'

type RestoreStatus = 'idle' | 'loading' | 'ready'

type AuthStoreState = {
  token: string
  loginScope: LoginScope | null
  user: AuthSessionSnapshot['user'] | null
  tenant: AuthSessionSnapshot['tenant'] | null
  permissions: string[]
  menuTree: AuthSessionSnapshot['menuTree']
  restoreStatus: RestoreStatus
  setToken: (token: string) => void
  setSession: (session: AuthSessionResponse) => void
  setSessionSnapshot: (session: AuthSessionSnapshot) => void
  setRestoreStatus: (status: RestoreStatus) => void
  reset: () => void
}

const emptyAuthState = {
  token: '',
  loginScope: null,
  user: null,
  tenant: null,
  permissions: [],
  menuTree: [],
} satisfies Omit<
  AuthStoreState,
  'restoreStatus' | 'setToken' | 'setSession' | 'setSessionSnapshot' | 'setRestoreStatus' | 'reset'
>

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      ...emptyAuthState,
      restoreStatus: 'idle',
      setToken: (token) =>
        set({
          ...emptyAuthState,
          token,
          restoreStatus: 'idle',
        }),
      setSession: (session) =>
        set((state) => ({
          ...state,
          loginScope: session.loginScope,
          user: session.user,
          tenant: session.tenant,
          permissions: session.permissions,
          menuTree: session.menuTree,
          restoreStatus: 'ready',
        })),
      setSessionSnapshot: (session) =>
        set({
          token: session.token,
          loginScope: session.loginScope,
          user: session.user,
          tenant: session.tenant,
          permissions: session.permissions,
          menuTree: session.menuTree,
          restoreStatus: 'ready',
        }),
      setRestoreStatus: (restoreStatus) => set({ restoreStatus }),
      reset: () =>
        set({
          ...emptyAuthState,
          restoreStatus: 'ready',
        }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        loginScope: state.loginScope,
        user: state.user,
        tenant: state.tenant,
        permissions: state.permissions,
        menuTree: state.menuTree,
      }),
    }
  )
)
