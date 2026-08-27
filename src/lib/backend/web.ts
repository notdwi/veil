import type {
  Collection,
  Environment,
  HistoryEntry,
  HttpResponsePayload,
  RequestDraft,
  SendRequestInput,
} from '@/types'
import type { Backend } from './port'

/** Browser-only stand-in used by `vite dev` so the UI can be built and reviewed
 *  without the native shell. Never bundled into a meaningful production path. */

const NS = 'veil:web:'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(NS + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  localStorage.setItem(NS + key, JSON.stringify(value))
}

function upsert<T extends { id: string }>(key: string, item: T): void {
  const rows = read<T[]>(key, [])
  const idx = rows.findIndex((r) => r.id === item.id)
  if (idx >= 0) rows[idx] = item
  else rows.push(item)
  write(key, rows)
}

function drop<T extends { id: string }>(key: string, id: string): void {
  write(
    key,
    read<T[]>(key, []).filter((r) => r.id !== id),
  )
}

export const webBackend: Backend = {
  kind: 'web',

  async send(input: SendRequestInput): Promise<HttpResponsePayload> {
    const started = performance.now()
    const res = await fetch(input.url, {
      method: input.method,
      headers: input.headers,
      body: input.body ?? undefined,
      redirect: 'follow',
    })
    const body = await res.text()
    return {
      status: res.status,
      statusText: res.statusText,
      headers: [...res.headers.entries()],
      body,
      durationMs: Math.round(performance.now() - started),
      sizeBytes: new Blob([body]).size,
      finalUrl: res.url || input.url,
    }
  },

  async listCollections() {
    return read<Collection[]>('collections', [])
  },
  async saveCollection(collection) {
    upsert('collections', collection)
  },
  async deleteCollection(id) {
    drop<Collection>('collections', id)
    write(
      'requests',
      read<RequestDraft[]>('requests', []).filter((r) => r.collectionId !== id),
    )
  },

  async listRequests() {
    return read<RequestDraft[]>('requests', [])
  },
  async saveRequest(request) {
    upsert('requests', request)
  },
  async deleteRequest(id) {
    drop<RequestDraft>('requests', id)
  },

  async listHistory(limit) {
    return read<HistoryEntry[]>('history', [])
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit)
  },
  async pushHistory(entry) {
    const rows = [entry, ...read<HistoryEntry[]>('history', [])].slice(0, 200)
    write('history', rows)
  },
  async clearHistory() {
    write('history', [])
  },

  async listEnvironments() {
    return read<Environment[]>('environments', [])
  },
  async saveEnvironment(environment) {
    upsert('environments', environment)
  },
  async deleteEnvironment(id) {
    drop<Environment>('environments', id)
  },

  async readSecret(ref) {
    return read<Record<string, string>>('secrets', {})[ref] ?? null
  },
  async writeSecret(ref, value) {
    write('secrets', { ...read<Record<string, string>>('secrets', {}), [ref]: value })
  },
  async removeSecret(ref) {
    const all = read<Record<string, string>>('secrets', {})
    delete all[ref]
    write('secrets', all)
  },
}
