import { useAuthStore } from '@/stores/auth-store'

const BASE_URL = '/api/v1'

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>
}

interface CommonResult<T> {
  code: number
  msg: string
  data: T
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: number,
    message: string,
    public readonly payload?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function parseResult<T>(response: Response) {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return null
  }

  return (await response.json()) as CommonResult<T>
}

async function request<T>(url: string, options: RequestOptions = {}) {
  const { params, ...init } = options
  let fullUrl = `${BASE_URL}${url}`

  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    const query = searchParams.toString()
    if (query) {
      fullUrl += `?${query}`
    }
  }

  const token = useAuthStore.getState().token
  const response = await fetch(fullUrl, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })

  const result = await parseResult<T>(response)

  if (!response.ok) {
    throw new ApiError(
      response.status,
      result?.code ?? response.status,
      result?.msg ?? response.statusText,
      result
    )
  }

  if (!result) {
    return undefined as T
  }

  if (result.code !== 0) {
    throw new ApiError(
      response.status || 200,
      result.code,
      result.msg || 'Request failed',
      result
    )
  }

  return result.data
}

export const api = {
  get: <T>(url: string, params?: Record<string, string | number | undefined>) =>
    request<T>(url, { method: 'GET', params }),

  post: <T>(url: string, data?: unknown) =>
    request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(url: string, data?: unknown) =>
    request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  del: <T>(url: string) =>
    request<T>(url, { method: 'DELETE' }),
}
