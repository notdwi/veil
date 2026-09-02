import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { IconButton } from '@/components/ui/IconButton'
import { MethodBadge } from '@/components/ui/MethodBadge'
import { formatClock, formatDuration } from '@/lib/format'
import { hostOf, shortPath } from '@/lib/history'
import { statusColor } from '@/lib/http-meta'
import type { HistoryEntry } from '@/types'

export const HISTORY_COLUMNS = 'minmax(0,1fr) 62px 66px 84px 26px'

interface HistoryTableRowProps {
  entry: HistoryEntry
  onOpen(): void
  onDelete(): void
}

export function HistoryTableRow({ entry, onOpen, onDelete }: HistoryTableRowProps) {
  const color = entry.status == null ? 'var(--color-crimson-hot)' : statusColor(entry.status)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
      title={entry.url}
      className={cn(
        'group grid cursor-pointer items-center gap-x-3 border-b border-hairline/50 py-[6px] pr-1 pl-1',
        'transition-[background-color,transform] duration-(--t-tick) ease-(--ease-snap)',
        'hover:translate-x-[2px] hover:bg-ink-3/70',
      )}
      style={{ gridTemplateColumns: HISTORY_COLUMNS }}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <MethodBadge method={entry.method} size="xs" />
        <span className="min-w-0 truncate type-mono text-[12px] text-bone">
          {shortPath(entry.url)}
        </span>
        <span className="hidden shrink-0 type-mono text-[10px] text-bone-4 lg:inline">
          {hostOf(entry.url)}
        </span>
      </span>

      <span
        className="type-mono text-right text-[11.5px] font-bold tabular-nums"
        style={{ color }}
      >
        {entry.status ?? 'ERR'}
      </span>

      <span className="type-mono text-right text-[11px] tabular-nums text-bone-3">
        {entry.durationMs == null ? '—' : formatDuration(entry.durationMs)}
      </span>

      <span className="type-mono text-right text-[11px] text-bone-4">
        {formatClock(entry.createdAt)}
      </span>

      <IconButton
        label="Delete entry"
        tone="danger"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={11} strokeWidth={2.2} />
      </IconButton>
    </div>
  )
}
