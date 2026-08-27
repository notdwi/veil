import { create } from 'zustand'
import { backend } from '@/lib/backend'
import { uid } from '@/lib/id'
import type { Collection, RequestDraft } from '@/types'

interface CollectionsState {
  collections: Collection[]
  requests: RequestDraft[]
  collapsed: Record<string, boolean>
  hydrated: boolean

  hydrate(): Promise<void>
  createCollection(name: string): Promise<Collection>
  renameCollection(id: string, name: string): Promise<void>
  deleteCollection(id: string): Promise<void>
  toggleCollapsed(id: string): void

  upsertRequest(request: RequestDraft): Promise<void>
  deleteRequest(id: string): Promise<void>
  requestsIn(collectionId: string): RequestDraft[]
}

export const useCollectionsStore = create<CollectionsState>((set, get) => ({
  collections: [],
  requests: [],
  collapsed: {},
  hydrated: false,

  async hydrate() {
    const [collections, requests] = await Promise.all([
      backend.listCollections(),
      backend.listRequests(),
    ])
    set({ collections, requests, hydrated: true })
  },

  async createCollection(name) {
    const collection: Collection = { id: uid('col'), name, createdAt: Date.now() }
    await backend.saveCollection(collection)
    set((s) => ({ collections: [...s.collections, collection] }))
    return collection
  },

  async renameCollection(id, name) {
    const target = get().collections.find((c) => c.id === id)
    if (!target) return
    const next = { ...target, name }
    await backend.saveCollection(next)
    set((s) => ({ collections: s.collections.map((c) => (c.id === id ? next : c)) }))
  },

  async deleteCollection(id) {
    await backend.deleteCollection(id)
    set((s) => ({
      collections: s.collections.filter((c) => c.id !== id),
      requests: s.requests.filter((r) => r.collectionId !== id),
    }))
  },

  toggleCollapsed(id) {
    set((s) => ({ collapsed: { ...s.collapsed, [id]: !s.collapsed[id] } }))
  },

  async upsertRequest(request) {
    await backend.saveRequest(request)
    set((s) => {
      const exists = s.requests.some((r) => r.id === request.id)
      return {
        requests: exists
          ? s.requests.map((r) => (r.id === request.id ? request : r))
          : [...s.requests, request],
      }
    })
  },

  async deleteRequest(id) {
    await backend.deleteRequest(id)
    set((s) => ({ requests: s.requests.filter((r) => r.id !== id) }))
  },

  requestsIn(collectionId) {
    return get().requests.filter((r) => r.collectionId === collectionId)
  },
}))
