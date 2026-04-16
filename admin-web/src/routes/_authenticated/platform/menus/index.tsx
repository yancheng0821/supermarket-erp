import { createFileRoute } from '@tanstack/react-router'
import { PlatformMenusPage } from '@/features/platform/menus'

export const Route = createFileRoute('/_authenticated/platform/menus/')({
  component: PlatformMenusPage,
})
