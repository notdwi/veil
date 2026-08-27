import { useEffect } from 'react'

export interface HotkeyMap {
  [combo: string]: (event: KeyboardEvent) => void
}

function comboOf(e: KeyboardEvent): string {
  const parts: string[] = []
  if (e.ctrlKey || e.metaKey) parts.push('mod')
  if (e.shiftKey) parts.push('shift')
  if (e.altKey) parts.push('alt')
  parts.push(e.key.toLowerCase())
  return parts.join('+')
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable ||
    !!target.closest('.cm-editor')
  )
}

/** Global shortcuts. Modifier combos still fire inside editors; bare keys do not. */
export function useHotkeys(map: HotkeyMap, enabled = true): void {
  useEffect(() => {
    if (!enabled) return
    const handler = (e: KeyboardEvent) => {
      const combo = comboOf(e)
      const fn = map[combo]
      if (!fn) return
      const bare = !combo.startsWith('mod')
      if (bare && isTypingTarget(e.target)) return
      e.preventDefault()
      fn(e)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [map, enabled])
}
