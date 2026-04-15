const BASE_URL = '/api/v1'

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>
}

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...init } = options

  // Build query string
  let fullUrl = `${BASE_URL}${url}`
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    const qs = searchParams.toString()
    if (qs) fullUrl += `?${qs}`
  }

  // Get token from localStorage
  const token = localStorage.getItem('erp_token')

  const response = await fetch(fullUrl, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'tenant-id': localStorage.getItem('erp_tenant_id') || '1',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })

  const result = await response.json()

  if (result.code !== 0) {
    throw new Error(result.msg || 'Request failed')
  }

  return result.data
}

export const api = {
  get: <T>(url: string, params?: Record<string, string | number | undefined>) =>
    request<T>(url, { method: 'GET', params }),

  post: <T>(url: string, data?: unknown) =>
    request<T>(url, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),

  put: <T>(url: string, data?: unknown) =>
    request<T>(url, { method: 'PUT', body: data ? JSON.stringify(data) : undefined }),

  del: <T>(url: string) =>
    request<T>(url, { method: 'DELETE' }),
}
