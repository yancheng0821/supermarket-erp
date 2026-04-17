import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PlatformSignInPage } from '@/features/auth/sign-in/platform-sign-in-page'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in/platform')({
  component: PlatformSignInPage,
  validateSearch: searchSchema,
})
