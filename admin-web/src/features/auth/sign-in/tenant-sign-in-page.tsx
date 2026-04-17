import { useSearch } from '@tanstack/react-router'
import { RoleSignIn } from './role-sign-in'

export function TenantSignInPage() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in/tenant' })

  return <RoleSignIn mode='tenant' redirectTo={redirect} />
}
