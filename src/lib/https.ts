const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: unknown
  cache?: RequestCache
  tags?: string[]
}

const httpClient = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const {
    method = 'GET',
    headers = {},
    body,
    cache = 'default',
    tags = [],
  } = options

  const isFormatData = body instanceof FormData

  const finalHeaders = isFormatData
    ? headers
    : {
        ...headers,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: finalHeaders,
    body:
      method === 'GET' ? undefined : isFormatData ? body : JSON.stringify(body),
    cache,
    next: tags.length > 0 ? { tags } : undefined,
  })

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    httpClient<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, options?: RequestOptions) =>
    httpClient<T>(endpoint, { ...options, method: 'POST' }),
  put: <T>(endpoint: string, options?: RequestOptions) =>
    httpClient<T>(endpoint, { ...options, method: 'PUT' }),
  patch: <T>(endpoint: string, options?: RequestOptions) =>
    httpClient<T>(endpoint, { ...options, method: 'PATCH' }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    httpClient<T>(endpoint, { ...options, method: 'DELETE' }),
}
