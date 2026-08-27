export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

export function formatClock(ts: number): string {
  const d = new Date(ts)
  const today = new Date()
  const sameDay = d.toDateString() === today.toDateString()
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return sameDay ? time : `${d.toLocaleDateString([], { day: '2-digit', month: 'short' })} ${time}`
}

export function tryPrettyJson(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
}

export function isJsonLike(raw: string, contentType?: string): boolean {
  if (contentType?.includes('json')) return true
  const t = raw.trimStart()
  return t.startsWith('{') || t.startsWith('[')
}

/** Renders a token as a fixed-width mask so length is never leaked. */
export function maskSecret(value: string): string {
  return value ? '••••••••••••' : ''
}
