import { createFileRoute } from '@tanstack/react-router'
import { CategoriesPage } from '@/features/archive/categories'

export const Route = createFileRoute('/_authenticated/archive/categories/')({
  component: CategoriesPage,
})
