import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EmptyState } from '@/components/ui/EmptyState'
import { GhostButton } from '@/components/ui/GhostButton'
import { IconButton } from '@/components/ui/IconButton'
import { Modal } from '@/components/ui/Modal'
import { useEnvStore } from '@/stores/useEnvStore'
import { useUiStore } from '@/stores/useUiStore'
import { EnvVariableRow } from './EnvVariableRow'

export function EnvEditor() {
  const open = useUiStore((s) => s.envEditorOpen)
  const setOpen = useUiStore((s) => s.setEnvEditorOpen)
  const { environments, activeId, setActive, addVariable, setVariables, remove, create } = useEnvStore()

  const current = environments.find((e) => e.id === activeId) ?? environments[0] ?? null

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="Environment variables"
      width={760}
      footer={
        <>
          {current && (
            <GhostButton onClick={() => void remove(current.id)}>
              <Trash2 size={11} strokeWidth={2.2} />
              Delete environment
            </GhostButton>
          )}
          <GhostButton tone="crimson" onClick={() => setOpen(false)}>
            Done
          </GhostButton>
        </>
      }
    >
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {environments.map((env) => (
          <button
            key={env.id}
            onClick={() => setActive(env.id)}
            className={cn(
              'skew-bar h-[22px] px-3 transition-colors duration-(--t-tick)',
              env.id === current?.id ? 'bg-magenta text-ink' : 'bg-ink-3 text-bone-3 hover:bg-ink-4',
            )}
          >
            <span className="unskew block type-label">{env.name}</span>
          </button>
        ))}
        <IconButton label="New environment" onClick={() => void create(`Environment ${environments.length + 1}`)}>
          <Plus size={13} strokeWidth={2.6} />
        </IconButton>
      </div>

      {!current ? (
        <EmptyState
          title="No environment"
          hint="Create one to define {{base_url}}, {{token}} and friends."
        />
      ) : (
        <>
          <div className="grid grid-cols-[26px_minmax(120px,1fr)_minmax(160px,1.6fr)_32px_26px] items-center gap-x-1 border-b border-hairline pb-1.5">
            <span />
            <span className="type-label px-2.5 text-bone-4">Key</span>
            <span className="type-label px-2.5 text-bone-4">Value</span>
            <span className="type-label text-center text-bone-4">Sec</span>
            <span />
          </div>

          <div className="stagger">
            {current.variables.map((variable) => (
              <EnvVariableRow
                key={variable.id}
                variable={variable}
                onChange={(patch) =>
                  void setVariables(
                    current.id,
                    current.variables.map((v) => (v.id === variable.id ? { ...v, ...patch } : v)),
                  )
                }
                onRemove={() =>
                  void setVariables(
                    current.id,
                    current.variables.filter((v) => v.id !== variable.id),
                  )
                }
              />
            ))}
          </div>

          {!current.variables.length && (
            <EmptyState compact title="Empty" hint="Add your first variable." />
          )}

          <div className="mt-3 flex items-center justify-between">
            <GhostButton size="xs" onClick={() => void addVariable(current.id)}>
              <Plus size={11} strokeWidth={2.6} />
              Add variable
            </GhostButton>
            <p className="type-label text-[8.5px] text-bone-4">
              Secrets live in the OS credential store — never in the workspace file
            </p>
          </div>
        </>
      )}
    </Modal>
  )
}
