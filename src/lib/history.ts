import type { HistoryEntry, HttpMethod } from '@/types'

/** Consecutive runs of the same request with the same outcome, rolled into one. */
export interface HistoryRun {
  ids: string[]
  entry: HistoryEntry
  count: number
}

export type StatusClass = 'all' | '2xx' | '3xx' | '4xx' | '5xx' | 'err'

export interface HistoryFilter {
  query: string
  method: HttpMethod | 'all'
  statusClass: StatusClass
}

export const EMPTY_FILTER: HistoryFilter = { query: '', method: 'all', statusClass: 'all' }

export function shortPath(url: string): string {
  try {
    const u = new URL(url)
    return `${u.pathname}${u.search}` || u.hostname
  } catch {
    return url.replace(/^https?:\/\//, '')
  }
}

export function hostOf(url: string): string {
  try {
    return new URL(url).host
  } catch {
    return ''
  }
}

export function statusClassOf(status: number | null): StatusClass {
  if (status == null) return 'err'
  if (status < 300) return '2xx'
  if (status < 400) return '3xx'
  if (status < 500) return '4xx'
  return '5xx'
}

/** A run only collapses when the outcome matched too, so one 500 among twenty
 *  200s never disappears into a count. */
function signature(entry: HistoryEntry): string {
  return `${entry.method} ${entry.url} ${entry.status ?? 'err'}`
}

/** Expects entries newest-first, which is how both backends return them. */
export function collapseRuns(entries: HistoryEntry[]): HistoryRun[] {
  const runs: HistoryRun[] = []
  for (const entry of entries) {
    const last = runs[runs.length - 1]
    if (last && signature(last.entry) === signature(entry)) {
      last.ids.push(entry.id)
      last.count += 1
    } else {
      runs.push({ ids: [entry.id], entry, count: 1 })
    }
  }
  return runs
}

export function filterHistory(entries: HistoryEntry[], filter: HistoryFilter): HistoryEntry[] {
  const q = filter.query.trim().toLowerCase()
  return entries.filter((e) => {
    if (filter.method !== 'all' && e.method !== filter.method) return false
    if (filter.statusClass !== 'all' && statusClassOf(e.status) !== filter.statusClass) return false
    if (!q) return true
    return `${e.method} ${e.url} ${e.status ?? 'err'}`.toLowerCase().includes(q)
  })
}

/** Methods actually present, so the filter never offers a dead option. */
export function methodsPresent(entries: HistoryEntry[]): HttpMethod[] {
  const seen = new Set<HttpMethod>()
  for (const e of entries) seen.add(e.method)
  return [...seen]
}
