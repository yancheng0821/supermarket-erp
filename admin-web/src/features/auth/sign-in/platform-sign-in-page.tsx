import { useSearch } from '@tanstack/react-router'
import { RoleSignIn } from './role-sign-in'

export function PlatformSignInPage() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in/platform' })

  return <RoleSignIn mode='platform' redirectTo={redirect} />
}
