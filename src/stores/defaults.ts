import { uid } from '@/lib/id'
import type { AuthConfig, Environment, KeyValue, RequestDraft } from '@/types'

export function emptyRow(): KeyValue {
  return { id: uid('kv'), key: '', value: '', enabled: true }
}

export function emptyAuth(): AuthConfig {
  return { mode: 'none', username: '', password: '', token: '' }
}

export function emptyDraft(overrides: Partial<RequestDraft> = {}): RequestDraft {
  return {
    id: uid('req'),
    collectionId: null,
    name: 'Untitled request',
    method: 'GET',
    url: '',
    params: [emptyRow()],
    headers: [emptyRow()],
    bodyMode: 'none',
    body: '',
    auth: emptyAuth(),
    updatedAt: Date.now(),
    ...overrides,
  }
}

export function emptyEnvironment(name: string): Environment {
  return { id: uid('env'), name, variables: [], createdAt: Date.now() }
}

/** Keeps exactly one trailing blank row so the table always has an entry point. */
export function withTrailingRow(rows: KeyValue[]): KeyValue[] {
  const filled = rows.filter((r) => r.key || r.value)
  return [...filled, emptyRow()]
}
