import { useEffect, useMemo, useRef, useState } from 'react'
import { CornerDownLeft, Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Halftone } from '@/components/deco/Halftone'
import { KeyHint } from '@/components/ui/KeyHint'
import { useUiStore } from '@/stores/useUiStore'
import { filterCommands, useCommands, type Command } from './commands'

const GROUP_ORDER: Command['group'][] = ['Request', 'Workspace', 'View']

export function CommandPalette() {
  const open = useUiStore((s) => s.paletteOpen)
  const setOpen = useUiStore((s) => s.setPaletteOpen)
  const commands = useCommands()
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => filterCommands(commands, query), [commands, query])

  const grouped = useMemo(() => {
    const map = new Map<Command['group'], Command[]>()
    for (const g of GROUP_ORDER) map.set(g, [])
    for (const c of results) map.get(c.group)?.push(c)
    return [...map.entries()].filter(([, items]) => items.length)
  }, [results])

  useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
    }
  }, [open])

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  if (!open) return null

  const run = (command?: Command) => {
    if (!command) return
    setOpen(false)
    command.run()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => (c + 1) % Math.max(results.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => (c - 1 + results.length) % Math.max(results.length, 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(results[cursor])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    }
  }

  let flatIndex = -1

  return (
    <div className="fixed inset-0 z-[55] flex justify-center pt-[13vh]">
      <button
        aria-label="Close command palette"
        onClick={() => setOpen(false)}
        className="absolute inset-0 cursor-default bg-ink/88 backdrop-blur-[2px]"
      >
        <Halftone className="text-crimson/12" variant="dots-lg" />
      </button>

      <div
        role="dialog"
        aria-modal
        aria-label="Command palette"
        onKeyDown={onKeyDown}
        className="clip-shard anim-pop relative flex max-h-[62vh] w-full max-w-[620px] flex-col overflow-hidden bg-ink-2 shadow-[0_0_0_1px_var(--color-hairline),var(--shadow-lift)]"
      >
        <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-crimson" />

        <div className="flex shrink-0 items-center gap-2.5 px-4 pt-4 pb-3">
          <Search size={14} strokeWidth={2.4} className="shrink-0 text-crimson" />
          <input
            autoFocus
            value={query}
            spellCheck={false}
            placeholder="Type a command…"
            onChange={(e) => {
              setQuery(e.target.value)
              setCursor(0)
            }}
            className="w-full bg-transparent text-[14px] text-bone placeholder:text-bone-4"
          />
          <KeyHint keys="Esc" />
        </div>

        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto border-t border-hairline pb-2">
          {!results.length && (
            <p className="px-4 py-8 text-center type-label text-bone-4">no matching command</p>
          )}

          {grouped.map(([group, items]) => (
            <div key={group}>
              <div className="px-4 pt-3 pb-1 type-label text-[8.5px] text-bone-4">{group}</div>
              {items.map((command) => {
                flatIndex += 1
                const active = flatIndex === cursor
                const index = flatIndex
                return (
                  <button
                    key={command.id}
                    data-active={active}
                    onMouseMove={() => setCursor(index)}
                    onClick={() => run(command)}
                    className={cn(
                      'group relative flex w-full items-center gap-2 py-[7px] pr-4 pl-4 text-left',
                      'transition-transform duration-(--t-tick) ease-(--ease-snap)',
                      active ? 'translate-x-[4px]' : 'hover:translate-x-[2px]',
                    )}
                  >
                    {active && (
                      <span aria-hidden className="skew-bar absolute inset-y-0 left-1 right-2 -z-10 bg-crimson" />
                    )}
                    <span
                      className={cn(
                        'flex-1 truncate text-[12.5px]',
                        active ? 'font-semibold text-bone' : 'text-bone-2',
                      )}
                    >
                      {command.label}
                    </span>
                    {command.keys && <KeyHint keys={command.keys} tone={active ? 'bone' : 'muted'} />}
                    {active && <CornerDownLeft size={12} strokeWidth={2.4} className="text-bone" />}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <footer className="flex shrink-0 items-center gap-3 border-t border-hairline px-4 py-2">
          <KeyHint keys="↑↓" label="Navigate" />
          <KeyHint keys="↵" label="Run" />
          <span className="ml-auto type-label text-[8px] text-bone-4">{results.length} commands</span>
        </footer>
      </div>
    </div>
  )
}
