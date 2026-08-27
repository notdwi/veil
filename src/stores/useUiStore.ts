import { create } from 'zustand'
import { uid } from '@/lib/id'
import { loadPrefs, savePrefs, type LanguageCode, type LayoutMode } from '@/lib/prefs'

export type SidebarSection = 'collections' | 'history' | 'environment'
export type RequestTab = 'params' | 'headers' | 'body' | 'auth'
export type ResponseTab = 'pretty' | 'raw' | 'headers'

export interface Toast {
  id: string
  message: string
  tone: 'info' | 'good' | 'bad'
}

interface UiState {
  layout: LayoutMode
  language: LanguageCode
  settingsOpen: boolean
  sidebarWidth: number
  responseRatio: number
  requestTab: RequestTab
  responseTab: ResponseTab
  openSections: Record<SidebarSection, boolean>
  paletteOpen: boolean
  envEditorOpen: boolean
  urlFocusSignal: number
  toasts: Toast[]

  setLayout(layout: LayoutMode): void
  setLanguage(language: LanguageCode): void
  setSettingsOpen(open: boolean): void
  setSidebarWidth(px: number): void
  setResponseRatio(ratio: number): void
  setRequestTab(tab: RequestTab): void
  setResponseTab(tab: ResponseTab): void
  toggleSection(section: SidebarSection): void
  setPaletteOpen(open: boolean): void
  setEnvEditorOpen(open: boolean): void
  focusUrl(): void
  toast(message: string, tone?: Toast['tone']): void
  dismissToast(id: string): void
}

export const SIDEBAR_MIN = 208
export const SIDEBAR_MAX = 400

const prefs = loadPrefs()

export const useUiStore = create<UiState>((set, get) => ({
  layout: prefs.layout,
  language: prefs.language,
  settingsOpen: false,
  sidebarWidth: 252,
  responseRatio: 0.52,
  requestTab: 'params',
  responseTab: 'pretty',
  openSections: { collections: true, history: true, environment: true },
  paletteOpen: false,
  envEditorOpen: false,
  urlFocusSignal: 0,
  toasts: [],

  setLayout: (layout) => {
    savePrefs({ layout, language: get().language })
    set({ layout })
  },
  setLanguage: (language) => {
    savePrefs({ layout: get().layout, language })
    set({ language })
  },
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),

  setSidebarWidth: (px) =>
    set({ sidebarWidth: Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, px)) }),
  setResponseRatio: (ratio) => set({ responseRatio: Math.min(0.8, Math.max(0.2, ratio)) }),
  setRequestTab: (requestTab) => set({ requestTab }),
  setResponseTab: (responseTab) => set({ responseTab }),
  toggleSection: (section) =>
    set((s) => ({ openSections: { ...s.openSections, [section]: !s.openSections[section] } })),
  setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
  setEnvEditorOpen: (envEditorOpen) => set({ envEditorOpen }),
  focusUrl: () => set((s) => ({ urlFocusSignal: s.urlFocusSignal + 1 })),

  toast: (message, tone = 'info') => {
    const id = uid('t')
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }))
    setTimeout(() => get().dismissToast(id), 3200)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
