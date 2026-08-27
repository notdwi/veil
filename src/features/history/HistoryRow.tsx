import { cn } from '@/lib/cn'
import { MethodBadge } from '@/components/ui/MethodBadge'
import { SlantRow } from '@/components/ui/SlantRow'
import { statusColor } from '@/lib/http-meta'
import { formatClock } from '@/lib/format'
import type { HistoryEntry } from '@/types'

interface HistoryRowProps {
  entry: HistoryEntry
  onOpen(): void
}

function shortPath(url: string): string {
  try {
    const u = new URL(url)
    return `${u.pathname}${u.search}` || u.hostname
  } catch {
    return url.replace(/^https?:\/\//, '')
  }
}

export function HistoryRow({ entry, onOpen }: HistoryRowProps) {
  return (
    <SlantRow
      onClick={onOpen}
      title={`${entry.method} ${entry.url} · ${formatClock(entry.createdAt)}`}
      leading={<MethodBadge method={entry.method} size="xs" />}
      trailing={
        <span
          className={cn('font-mono text-[9.5px] font-bold tabular-nums')}
          style={{ color: entry.status == null ? 'var(--color-crimson-hot)' : statusColor(entry.status) }}
        >
          {entry.status ?? 'ERR'}
        </span>
      }
    >
      <span className="type-mono text-[11px] text-bone-3">{shortPath(entry.url)}</span>
    </SlantRow>
  )
}
