export type LayoutMode = 'stacked' | 'split'
export type LanguageCode = 'en' | 'pt-BR' | 'es'

export interface Prefs {
  layout: LayoutMode
  language: LanguageCode
}

export const DEFAULT_PREFS: Prefs = { layout: 'stacked', language: 'en' }

const KEY = 'veil:prefs'

export function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<Prefs>) } : DEFAULT_PREFS
  } catch {
    return DEFAULT_PREFS
  }
}

export function savePrefs(prefs: Prefs): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs))
  } catch {
    /* storage unavailable — preferences stay session-only */
  }
}

export const LANGUAGES: { code: LanguageCode; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'pt-BR', label: 'Portuguese', native: 'Português (BR)' },
  { code: 'es', label: 'Spanish', native: 'Español' },
]
