import type { Environment, RequestDraft, SendRequestInput } from '@/types'
import { envMap, resolve } from './interpolate'
import { methodAllowsBody } from './http-meta'
import { normalizeUrl } from './url'

export interface BuiltRequest {
  input: SendRequestInput
  missingVars: string[]
  displayUrl: string
}

function appendQuery(url: string, pairs: [string, string][]): string {
  if (!pairs.length) return url
  const [base, existing] = url.split('#')[0].split('?')
  const sp = new URLSearchParams(existing ?? '')
  for (const [k, v] of pairs) sp.append(k, v)
  const qs = sp.toString()
  return qs ? `${base}?${qs}` : base
}

/** Turns a draft plus the active environment into exactly what the transport sends. */
export function buildRequest(
  draft: RequestDraft,
  environment: Environment | null,
  timeoutMs = 30_000,
): BuiltRequest {
  const vars = envMap(environment)
  const missing = new Set<string>()

  const take = (raw: string) => {
    const r = resolve(raw, vars)
    r.missing.forEach((m) => missing.add(m))
    return r.value
  }

  const url = normalizeUrl(take(draft.url))
  const query = draft.params
    .filter((p) => p.enabled && p.key.trim())
    .map((p) => [take(p.key), take(p.value)] as [string, string])

  const headers = draft.headers
    .filter((h) => h.enabled && h.key.trim())
    .map((h) => [take(h.key), take(h.value)] as [string, string])

  if (draft.auth.mode === 'bearer' && draft.auth.token.trim()) {
    headers.push(['Authorization', `Bearer ${take(draft.auth.token)}`])
  } else if (draft.auth.mode === 'basic' && draft.auth.username.trim()) {
    const encoded = btoa(`${take(draft.auth.username)}:${take(draft.auth.password)}`)
    headers.push(['Authorization', `Basic ${encoded}`])
  }

  const sendsBody = methodAllowsBody(draft.method) && draft.bodyMode !== 'none'
  const body = sendsBody ? take(draft.body) : null

  if (sendsBody && draft.bodyMode === 'json' && !headers.some(([k]) => k.toLowerCase() === 'content-type')) {
    headers.push(['Content-Type', 'application/json'])
  }

  const finalUrl = appendQuery(url, query)

  return {
    input: { method: draft.method, url: finalUrl, headers, body, timeoutMs },
    missingVars: [...missing],
    displayUrl: finalUrl,
  }
}
