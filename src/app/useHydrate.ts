import { useEffect, useState } from 'react'
import { useCollectionsStore } from '@/stores/useCollectionsStore'
import { useEnvStore } from '@/stores/useEnvStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { useUiStore } from '@/stores/useUiStore'

/** Loads every persisted store once, before the shell paints its first frame. */
export function useHydrate(): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      useCollectionsStore.getState().hydrate(),
      useHistoryStore.getState().hydrate(),
      useEnvStore.getState().hydrate(),
    ])
      .catch((err: unknown) => {
        useUiStore.getState().toast(`Workspace failed to load: ${String(err)}`, 'bad')
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return ready
}
