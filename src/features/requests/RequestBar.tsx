import { useMemo } from 'react'
import { KeyHint } from '@/components/ui/KeyHint'
import { buildRequest } from '@/lib/build-request'
import { activeEnvironment, useEnvStore } from '@/stores/useEnvStore'
import { useRequestStore } from '@/stores/useRequestStore'
import { ExecuteButton } from './ExecuteButton'
import { MethodSelect } from './MethodSelect'
import { UrlInput } from './UrlInput'

export function RequestBar() {
  const draft = useRequestStore((s) => s.draft)
  const phase = useRequestStore((s) => s.phase)
  const patch = useRequestStore((s) => s.patch)
  const execute = useRequestStore((s) => s.execute)
  const env = useEnvStore(activeEnvironment)

  const unresolved = useMemo(() => buildRequest(draft, env).missingVars, [draft, env])

  return (
    <div className="relative z-10 flex flex-wrap items-stretch gap-2 px-5 pt-3 pb-1">
      <MethodSelect value={draft.method} onChange={(method) => patch({ method })} />
      <UrlInput
        value={draft.url}
        onChange={(url) => patch({ url })}
        onSubmit={() => void execute()}
        unresolved={unresolved}
      />
      <div className="ml-auto flex w-[178px] shrink-0 flex-col items-start gap-[5px]">
        <ExecuteButton phase={phase} disabled={!draft.url.trim()} onClick={() => void execute()} />
        <KeyHint keys="Ctrl ↵" label="Run" className="pl-1 opacity-70" />
      </div>
    </div>
  )
}
