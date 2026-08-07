const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: unknown
  cache?: RequestCache
  tags?: string[]
  token?: string
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
    token,
  } = options

  const isFormatData = body instanceof FormData

  const finalHeaders = isFormatData
    ? headers
    : {
        ...headers,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { 'token-vinculacion': token } : {}),
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
    const errorBody = await res.json().catch(() => null)
    const message = errorBody?.msg || errorBody?.message || res.statusText
    console.error(`[API ${method}] ${endpoint} → ${res.status}`, JSON.stringify(errorBody))
    throw new ApiError(message, res.status)
  }

  return res.json() as Promise<T>
}

export function authHeader(token?: string): Record<string, string> | undefined {
  return token ? { 'token-vinculacion': token } : undefined
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
