import { Circle, Dot } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { GhostButton } from '@/components/ui/GhostButton'
import { SlantRow } from '@/components/ui/SlantRow'
import { useEnvStore } from '@/stores/useEnvStore'

interface EnvListProps {
  onCreate(): void
}

export function EnvList({ onCreate }: EnvListProps) {
  const environments = useEnvStore((s) => s.environments)
  const activeId = useEnvStore((s) => s.activeId)
  const setActive = useEnvStore((s) => s.setActive)

  if (!environments.length) {
    return (
      <EmptyState
        compact
        title="None"
        hint="Holds {{variables}}"
        action={
          <GhostButton size="xs" tone="crimson" onClick={onCreate}>
            Create
          </GhostButton>
        }
      />
    )
  }

  return (
    <div className="stagger pb-1">
      {environments.map((env) => {
        const active = env.id === activeId
        return (
          <SlantRow
            key={env.id}
            active={active}
            onClick={() => setActive(active ? null : env.id)}
            leading={
              active ? (
                <Dot size={14} strokeWidth={6} className="text-crimson" />
              ) : (
                <Circle size={8} strokeWidth={2.6} className="text-bone-4" />
              )
            }
            trailing={
              <span className="font-mono text-[9.5px] text-bone-4">{env.variables.length}</span>
            }
          >
            {env.name}
          </SlantRow>
        )
      })}
    </div>
  )
}
