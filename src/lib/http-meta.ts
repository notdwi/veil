import type { HttpMethod } from '@/types'

const METHOD_TOKEN: Record<HttpMethod, string> = {
  GET: 'var(--color-m-get)',
  POST: 'var(--color-m-post)',
  PUT: 'var(--color-m-put)',
  PATCH: 'var(--color-m-patch)',
  DELETE: 'var(--color-m-delete)',
  HEAD: 'var(--color-m-head)',
  OPTIONS: 'var(--color-m-options)',
}

export function methodColor(method: HttpMethod): string {
  return METHOD_TOKEN[method] ?? 'var(--color-bone-3)'
}

export function methodAllowsBody(method: HttpMethod): boolean {
  return method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE'
}

export type StatusTone = 'success' | 'redirect' | 'client' | 'server' | 'idle'

export function statusTone(status: number | null): StatusTone {
  if (status == null) return 'idle'
  if (status < 300) return 'success'
  if (status < 400) return 'redirect'
  if (status < 500) return 'client'
  return 'server'
}

export function statusColor(status: number | null): string {
  switch (statusTone(status)) {
    case 'success':
      return 'var(--color-jade)'
    case 'redirect':
      return 'var(--color-azure)'
    case 'client':
      return 'var(--color-amber)'
    case 'server':
      return 'var(--color-crimson-hot)'
    default:
      return 'var(--color-bone-3)'
  }
}

const STATUS_TEXT: Record<number, string> = {
  200: 'OK',
  201: 'CREATED',
  202: 'ACCEPTED',
  204: 'NO CONTENT',
  301: 'MOVED PERMANENTLY',
  302: 'FOUND',
  304: 'NOT MODIFIED',
  400: 'BAD REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT FOUND',
  405: 'METHOD NOT ALLOWED',
  408: 'REQUEST TIMEOUT',
  409: 'CONFLICT',
  422: 'UNPROCESSABLE ENTITY',
  429: 'TOO MANY REQUESTS',
  500: 'SERVER ERROR',
  502: 'BAD GATEWAY',
  503: 'SERVICE UNAVAILABLE',
  504: 'GATEWAY TIMEOUT',
}

export function statusLabel(status: number, fallback?: string): string {
  return STATUS_TEXT[status] ?? ((fallback ?? '').toUpperCase() || 'RESPONSE')
}

export function findHeader(headers: [string, string][], name: string): string | undefined {
  const lower = name.toLowerCase()
  return headers.find(([k]) => k.toLowerCase() === lower)?.[1]
}
