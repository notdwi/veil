import { Braces, FileText, Minus, Wand2 } from 'lucide-react'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { GhostButton } from '@/components/ui/GhostButton'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkewTabs } from '@/components/ui/SkewTabs'
import { tryPrettyJson } from '@/lib/format'
import { methodAllowsBody } from '@/lib/http-meta'
import { useRequestStore } from '@/stores/useRequestStore'
import type { BodyMode } from '@/types'

const MODES = [
  { id: 'none' as const, label: 'None', icon: Minus },
  { id: 'json' as const, label: 'JSON', icon: Braces },
  { id: 'text' as const, label: 'Text', icon: FileText },
]

export function BodyTab() {
  const { method, bodyMode, body } = useRequestStore((s) => s.draft)
  const patch = useRequestStore((s) => s.patch)

  if (!methodAllowsBody(method)) {
    return (
      <EmptyState
        title="No body"
        hint={`${method} requests do not carry a payload. Switch to POST, PUT, PATCH or DELETE.`}
      />
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between pb-2">
        <SkewTabs
          size="sm"
          items={MODES.map((m) => ({ id: m.id, label: m.label }))}
          value={bodyMode}
          onChange={(mode: BodyMode) => patch({ bodyMode: mode })}
        />
        {bodyMode === 'json' && (
          <GhostButton size="xs" onClick={() => patch({ body: tryPrettyJson(body) })}>
            <Wand2 size={11} strokeWidth={2.2} />
            Format
          </GhostButton>
        )}
      </div>

      {bodyMode === 'none' ? (
        <EmptyState title="No body" hint="Pick JSON or Text to add a payload." />
      ) : (
        <div className="min-h-0 flex-1 border-t border-hairline">
          <CodeEditor
            value={body}
            language={bodyMode === 'json' ? 'json' : 'text'}
            placeholder={bodyMode === 'json' ? '{\n  "key": "value"\n}' : 'raw body'}
            onChange={(next) => patch({ body: next })}
          />
        </div>
      )}
    </div>
  )
}
