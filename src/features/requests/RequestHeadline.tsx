import { Check, Copy, Save } from 'lucide-react'
import { GhostButton } from '@/components/ui/GhostButton'
import { Tag } from '@/components/ui/Tag'
import { useClipboard } from '@/hooks/useClipboard'
import { buildRequest } from '@/lib/build-request'
import { toCurl } from '@/lib/curl'
import { activeEnvironment, useEnvStore } from '@/stores/useEnvStore'
import { useCollectionsStore } from '@/stores/useCollectionsStore'
import { useRequestStore } from '@/stores/useRequestStore'
import { useUiStore } from '@/stores/useUiStore'

export function RequestHeadline() {
  const draft = useRequestStore((s) => s.draft)
  const dirty = useRequestStore((s) => s.dirty)
  const patch = useRequestStore((s) => s.patch)
  const save = useRequestStore((s) => s.save)
  const collection = useCollectionsStore((s) => s.collections.find((c) => c.id === draft.collectionId))
  const env = useEnvStore(activeEnvironment)
  const toast = useUiStore((s) => s.toast)
  const { copied, copy } = useClipboard()

  const copyCurl = async () => {
    const ok = await copy(toCurl(buildRequest(draft, env).input))
    toast(ok ? 'cURL copied to clipboard' : 'Clipboard unavailable', ok ? 'good' : 'bad')
  }

  return (
    <div className="relative z-10 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 px-5 pt-3">
      <Tag>Request</Tag>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <input
          value={draft.name}
          onChange={(e) => patch({ name: e.target.value })}
          spellCheck={false}
          aria-label="Request name"
          className="min-w-0 max-w-[320px] flex-1 truncate bg-transparent text-[12px] font-semibold text-bone-2 outline-none placeholder:text-bone-4 hover:text-bone focus:text-bone"
          placeholder="Untitled request"
        />
        {collection && (
          <span className="type-label shrink-0 text-bone-4">
            <span className="text-crimson">/</span> {collection.name}
          </span>
        )}
        {dirty && (
          <span
            aria-label="Unsaved changes"
            className="h-[6px] w-[6px] shrink-0 skew-bar bg-crimson"
          />
        )}
      </div>

      <GhostButton size="xs" onClick={() => void copyCurl()}>
        {copied ? <Check size={11} strokeWidth={2.6} /> : <Copy size={11} strokeWidth={2.2} />}
        cURL
      </GhostButton>
      <GhostButton size="xs" tone="crimson" onClick={() => void save()}>
        <Save size={11} strokeWidth={2.2} />
        Save
      </GhostButton>
    </div>
  )
}
