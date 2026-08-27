import { useMemo } from 'react'
import { buildRequest } from '@/lib/build-request'
import { toCurl } from '@/lib/curl'
import { activeEnvironment, useEnvStore } from '@/stores/useEnvStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { useRequestStore } from '@/stores/useRequestStore'
import { useUiStore } from '@/stores/useUiStore'

export interface Command {
  id: string
  label: string
  group: 'Request' | 'Workspace' | 'View'
  keys?: string
  run(): void
}

/** Single source of truth for the palette. Shortcuts bind to the same ids. */
export function useCommands(): Command[] {
  const request = useRequestStore()
  const ui = useUiStore()
  const env = useEnvStore()
  const clearHistory = useHistoryStore((s) => s.clear)

  return useMemo(() => {
    const list: Command[] = [
      {
        id: 'request.execute',
        label: 'Execute request',
        group: 'Request',
        keys: 'Ctrl ↵',
        run: () => void request.execute(),
      },
      {
        id: 'request.save',
        label: 'Save request',
        group: 'Request',
        keys: 'Ctrl S',
        run: () => void request.save(),
      },
      {
        id: 'request.new',
        label: 'New request',
        group: 'Request',
        keys: 'Ctrl N',
        run: () => request.reset(),
      },
      {
        id: 'request.curl',
        label: 'Copy as cURL',
        group: 'Request',
        run: () => {
          const built = buildRequest(request.draft, activeEnvironment(env))
          void navigator.clipboard
            .writeText(toCurl(built.input))
            .then(() => ui.toast('cURL copied to clipboard', 'good'))
        },
      },
      {
        id: 'request.focus-url',
        label: 'Focus URL',
        group: 'Request',
        keys: 'Ctrl L',
        run: () => ui.focusUrl(),
      },
      {
        id: 'view.settings',
        label: 'Open settings',
        group: 'View',
        run: () => ui.setSettingsOpen(true),
      },
      {
        id: 'view.layout',
        label: ui.layout === 'split' ? 'Layout: move response below' : 'Layout: move response right',
        group: 'View',
        run: () => ui.setLayout(ui.layout === 'split' ? 'stacked' : 'split'),
      },
      {
        id: 'workspace.environments',
        label: 'Manage environment variables',
        group: 'Workspace',
        run: () => ui.setEnvEditorOpen(true),
      },
      {
        id: 'workspace.clear-history',
        label: 'Clear history',
        group: 'Workspace',
        run: () => void clearHistory(),
      },
      {
        id: 'view.collections',
        label: 'Toggle collections',
        group: 'View',
        run: () => ui.toggleSection('collections'),
      },
      {
        id: 'view.history',
        label: 'Toggle history',
        group: 'View',
        keys: 'Ctrl H',
        run: () => ui.toggleSection('history'),
      },
      {
        id: 'view.environment',
        label: 'Toggle environments',
        group: 'View',
        run: () => ui.toggleSection('environment'),
      },
    ]

    for (const environment of env.environments) {
      list.push({
        id: `env.activate.${environment.id}`,
        label: `Switch to ${environment.name}`,
        group: 'Workspace',
        run: () => env.setActive(environment.id),
      })
    }

    return list
  }, [request, ui, env, clearHistory])
}

export function filterCommands(commands: Command[], query: string): Command[] {
  const q = query.trim().toLowerCase()
  if (!q) return commands
  return commands
    .map((c) => ({ c, score: score(c.label.toLowerCase(), q) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.c)
}

/** Subsequence match: contiguous hits and word starts rank higher. */
function score(text: string, query: string): number {
  if (text.includes(query)) return 100 - text.indexOf(query)
  let ti = 0
  let hits = 0
  for (const ch of query) {
    const found = text.indexOf(ch, ti)
    if (found === -1) return 0
    hits += found === ti ? 2 : 1
    ti = found + 1
  }
  return hits
}
