import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { TenantSignInPage } from '@/features/auth/sign-in/tenant-sign-in-page'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in/tenant')({
  component: TenantSignInPage,
  validateSearch: searchSchema,
})
