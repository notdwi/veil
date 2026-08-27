import { Check, Copy, Search } from 'lucide-react'
import { GhostButton } from '@/components/ui/GhostButton'
import { StatusStamp } from '@/components/ui/StatusStamp'
import { SkewTabs } from '@/components/ui/SkewTabs'
import { Tag } from '@/components/ui/Tag'
import { useClipboard } from '@/hooks/useClipboard'
import { formatBytes, formatDuration } from '@/lib/format'
import { useUiStore, type ResponseTab } from '@/stores/useUiStore'
import type { HttpResponsePayload } from '@/types'

interface ResponseHeadlineProps {
  response: HttpResponsePayload | null
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-end leading-none">
      <span className={accent ? 'type-mono text-[12.5px] font-bold text-bone' : 'type-mono text-[12.5px] text-bone-2'}>
        {value}
      </span>
      <span className="type-label mt-[3px] text-[8px] text-bone-4">{label}</span>
    </div>
  )
}

export function ResponseHeadline({ response }: ResponseHeadlineProps) {
  const tab = useUiStore((s) => s.responseTab)
  const setTab = useUiStore((s) => s.setResponseTab)
  const { copied, copy } = useClipboard()

  return (
    <div className="relative z-10 shrink-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-5 pt-3">
        <Tag tone={response ? 'bone' : 'outline'}>Response</Tag>

        {response ? (
          <>
            <StatusStamp status={response.status} statusText={response.statusText} />
            <span aria-hidden className="ml-auto h-[22px] w-px bg-hairline" />
            <Metric label="time" value={formatDuration(response.durationMs)} accent />
            <Metric label="size" value={formatBytes(response.sizeBytes)} />
            <Metric label="headers" value={String(response.headers.length)} />
          </>
        ) : (
          <span className="type-label ml-auto text-bone-4">awaiting execution</span>
        )}
      </div>

      {response && (
        <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2 border-b border-hairline px-5 pt-2.5">
          <SkewTabs
            size="sm"
            value={tab}
            onChange={(next: ResponseTab) => setTab(next)}
            items={[
              { id: 'pretty', label: 'Pretty' },
              { id: 'raw', label: 'Raw' },
              { id: 'headers', label: 'Headers', badge: response.headers.length },
            ]}
          />
          <div className="flex items-center gap-1.5 pb-1">
            <GhostButton size="xs" onClick={() => void copy(response.body)}>
              {copied ? <Check size={11} strokeWidth={2.6} /> : <Copy size={11} strokeWidth={2.2} />}
              Copy
            </GhostButton>
            <span className="flex items-center gap-1 pl-1 type-label text-[8px] text-bone-4">
              <Search size={10} strokeWidth={2.4} /> Ctrl F
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
