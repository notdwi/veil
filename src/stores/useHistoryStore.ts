import { create } from 'zustand'
import { backend } from '@/lib/backend'
import type { HistoryEntry } from '@/types'

const LIMIT = 100

interface HistoryState {
  entries: HistoryEntry[]
  hydrated: boolean
  hydrate(): Promise<void>
  push(entry: HistoryEntry): Promise<void>
  remove(ids: string[]): Promise<void>
  clear(): Promise<void>
}

export const useHistoryStore = create<HistoryState>((set) => ({
  entries: [],
  hydrated: false,

  async hydrate() {
    set({ entries: await backend.listHistory(LIMIT), hydrated: true })
  },

  async push(entry) {
    set((s) => ({ entries: [entry, ...s.entries].slice(0, LIMIT) }))
    await backend.pushHistory(entry)
  },

  async remove(ids) {
    const drop = new Set(ids)
    set((s) => ({ entries: s.entries.filter((e) => !drop.has(e.id)) }))
    await backend.deleteHistoryEntries(ids)
  },

  async clear() {
    set({ entries: [] })
    await backend.clearHistory()
  },
}))
