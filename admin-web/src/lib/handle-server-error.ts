import { toast } from 'sonner'
import i18n from '@/i18n'
import { ApiError } from '@/lib/api'

export function handleServerError(error: unknown) {
  // eslint-disable-next-line no-console
  console.log(error)

  let errMsg = i18n.t('errors.somethingWentWrong')

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    errMsg = i18n.t('errors.contentNotFound')
  }

  if (error instanceof ApiError) {
    errMsg = error.message || errMsg
  }

  toast.error(errMsg)
}
