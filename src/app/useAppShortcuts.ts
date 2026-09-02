import { useMemo } from 'react'
import { useHotkeys } from '@/hooks/useHotkeys'
import { useRequestStore } from '@/stores/useRequestStore'
import { useUiStore } from '@/stores/useUiStore'

/** Binds the documented shortcut set. Palette commands share the same actions. */
export function useAppShortcuts(): void {
  const execute = useRequestStore((s) => s.execute)
  const save = useRequestStore((s) => s.save)
  const reset = useRequestStore((s) => s.reset)
  const ui = useUiStore()

  const map = useMemo(
    () => ({
      'mod+enter': () => void execute(),
      'mod+s': () => void save(),
      'mod+p': () => ui.setPaletteOpen(!ui.paletteOpen),
      'mod+l': () => ui.focusUrl(),
      'mod+h': () => ui.setHistoryPanelOpen(!ui.historyPanelOpen),
      'mod+n': () => reset(),
    }),
    [execute, save, reset, ui],
  )

  useHotkeys(map)
}
