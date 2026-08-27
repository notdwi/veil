import { create } from 'zustand'
import { backend } from '@/lib/backend'
import { buildRequest } from '@/lib/build-request'
import { uid } from '@/lib/id'
import { emptyDraft } from './defaults'
import { activeEnvironment, useEnvStore } from './useEnvStore'
import { useHistoryStore } from './useHistoryStore'
import { useCollectionsStore } from './useCollectionsStore'
import { useUiStore } from './useUiStore'
import type { AuthConfig, HttpFailure, HttpResponsePayload, RequestDraft } from '@/types'

export type Phase = 'idle' | 'sending' | 'done' | 'failed'

interface RequestState {
  draft: RequestDraft
  dirty: boolean
  phase: Phase
  response: HttpResponsePayload | null
  failure: HttpFailure | null

  patch(partial: Partial<RequestDraft>): void
  patchAuth(partial: Partial<AuthConfig>): void
  load(draft: RequestDraft): void
  reset(): void
  execute(): Promise<void>
  save(collectionId?: string | null): Promise<void>
}

function normalizeFailure(err: unknown, durationMs: number): HttpFailure {
  if (err && typeof err === 'object' && 'kind' in err && 'message' in err) {
    return { ...(err as HttpFailure), durationMs }
  }
  const message = err instanceof Error ? err.message : String(err)
  return { kind: 'network', message, durationMs }
}

let sequence = 0

export const useRequestStore = create<RequestState>((set, get) => ({
  draft: emptyDraft({ url: 'https://api.github.com/repos/rust-lang/rust' }),
  dirty: false,
  phase: 'idle',
  response: null,
  failure: null,

  patch(partial) {
    set((s) => ({ draft: { ...s.draft, ...partial, updatedAt: Date.now() }, dirty: true }))
  },

  patchAuth(partial) {
    set((s) => ({
      draft: { ...s.draft, auth: { ...s.draft.auth, ...partial }, updatedAt: Date.now() },
      dirty: true,
    }))
  },

  load(draft) {
    sequence += 1
    set({ draft: structuredClone(draft), dirty: false, phase: 'idle', response: null, failure: null })
  },

  reset() {
    sequence += 1
    set({ draft: emptyDraft(), dirty: false, phase: 'idle', response: null, failure: null })
  },

  async execute() {
    const { draft } = get()
    if (!draft.url.trim()) {
      useUiStore.getState().toast('No URL to execute', 'bad')
      return
    }

    const env = activeEnvironment(useEnvStore.getState())
    const built = buildRequest(draft, env)
    if (built.missingVars.length) {
      useUiStore.getState().toast(`Unresolved: {{${built.missingVars.join('}} {{')}}}`, 'bad')
      return
    }

    const ticket = ++sequence
    const started = performance.now()
    set({ phase: 'sending', response: null, failure: null })

    try {
      const response = await backend.send(built.input)
      if (ticket !== sequence) return
      set({ phase: 'done', response, failure: null })
      void useHistoryStore.getState().push({
        id: uid('hist'),
        method: draft.method,
        url: built.displayUrl,
        status: response.status,
        durationMs: response.durationMs,
        createdAt: Date.now(),
        snapshot: structuredClone(draft),
      })
    } catch (err) {
      if (ticket !== sequence) return
      const failure = normalizeFailure(err, Math.round(performance.now() - started))
      set({ phase: 'failed', failure, response: null })
      void useHistoryStore.getState().push({
        id: uid('hist'),
        method: draft.method,
        url: built.displayUrl,
        status: null,
        durationMs: failure.durationMs,
        createdAt: Date.now(),
        snapshot: structuredClone(draft),
      })
    }
  },

  async save(collectionId) {
    const { collections, createCollection, upsertRequest } = useCollectionsStore.getState()
    const target =
      collectionId ?? get().draft.collectionId ?? collections[0]?.id ?? (await createCollection('Workspace')).id

    const { draft } = get()
    const name = draft.name.trim() || draft.url.replace(/^https?:\/\//, '').slice(0, 40) || 'Untitled request'
    const next: RequestDraft = { ...draft, collectionId: target, name, updatedAt: Date.now() }

    await upsertRequest(next)
    set({ draft: next, dirty: false })
    useUiStore.getState().toast(`Saved · ${name}`, 'good')
  },
}))
