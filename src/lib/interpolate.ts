import type { Environment } from '@/types'

const TOKEN = /\{\{\s*([\w.-]+)\s*\}\}/g

export interface ResolveResult {
  value: string
  missing: string[]
}

export function envMap(env: Environment | null): Map<string, string> {
  const map = new Map<string, string>()
  if (!env) return map
  for (const v of env.variables) {
    if (v.enabled && v.key) map.set(v.key, v.value)
  }
  return map
}

/** Replaces {{token}} references. Unknown tokens are reported, not silently dropped. */
export function resolve(input: string, vars: Map<string, string>): ResolveResult {
  const missing: string[] = []
  const value = input.replace(TOKEN, (whole, key: string) => {
    const hit = vars.get(key)
    if (hit === undefined) {
      if (!missing.includes(key)) missing.push(key)
      return whole
    }
    return hit
  })
  return { value, missing }
}

export function extractTokens(input: string): string[] {
  const out: string[] = []
  for (const m of input.matchAll(TOKEN)) {
    if (!out.includes(m[1])) out.push(m[1])
  }
  return out
}

export function hasTokens(input: string): boolean {
  TOKEN.lastIndex = 0
  return TOKEN.test(input)
}
