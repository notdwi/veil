import { ChevronDown, Layers, Settings2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Popover } from '@/components/ui/Popover'
import { useEnvStore, activeEnvironment } from '@/stores/useEnvStore'
import { useUiStore } from '@/stores/useUiStore'

export function EnvSwitcher() {
  const environments = useEnvStore((s) => s.environments)
  const activeId = useEnvStore((s) => s.activeId)
  const setActive = useEnvStore((s) => s.setActive)
  const active = useEnvStore(activeEnvironment)
  const openEditor = useUiStore((s) => s.setEnvEditorOpen)

  const count = active?.variables.filter((v) => v.enabled).length ?? 0

  return (
    <Popover
      width={230}
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className={cn(
            'skew-bar group flex h-[24px] items-center gap-2 pr-2 pl-2.5 transition-colors duration-(--t-tick)',
            open ? 'bg-magenta text-ink' : 'bg-ink-3 text-bone-2 hover:bg-ink-4',
          )}
        >
          <span className="unskew flex items-center gap-1.5">
            <Layers size={11} strokeWidth={2.4} className={open ? 'text-ink' : 'text-magenta'} />
            <span className="type-label max-w-[130px] truncate">{active?.name ?? 'No environment'}</span>
            {count > 0 && (
              <span className={cn('font-mono text-[9px]', open ? 'text-ink/70' : 'text-bone-4')}>
                {count}
              </span>
            )}
            <ChevronDown size={11} strokeWidth={2.4} className="opacity-60" />
          </span>
        </button>
      )}
    >
      {(close) => (
        <div className="py-1">
          <button
            onClick={() => {
              setActive(null)
              close()
            }}
            className={cn(
              'flex w-full items-center px-3 py-1.5 type-label transition-colors duration-(--t-tick)',
              activeId === null ? 'bg-ink-4 text-bone' : 'text-bone-4 hover:bg-ink-3 hover:text-bone',
            )}
          >
            No environment
          </button>

          {environments.map((env) => (
            <button
              key={env.id}
              onClick={() => {
                setActive(env.id)
                close()
              }}
              className={cn(
                'flex w-full items-center justify-between gap-2 px-3 py-1.5 transition-colors duration-(--t-tick)',
                env.id === activeId ? 'bg-magenta text-ink' : 'text-bone-2 hover:bg-ink-3',
              )}
            >
              <span className="type-label truncate">{env.name}</span>
              <span className={cn('font-mono text-[9px]', env.id === activeId ? 'text-ink/70' : 'text-bone-4')}>
                {env.variables.length}
              </span>
            </button>
          ))}

          <div className="mt-1 border-t border-hairline pt-1">
            <button
              onClick={() => {
                openEditor(true)
                close()
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 type-label text-bone-3 transition-colors duration-(--t-tick) hover:bg-crimson hover:text-bone"
            >
              <Settings2 size={11} strokeWidth={2.4} />
              Manage variables
            </button>
          </div>
        </div>
      )}
    </Popover>
  )
}
