import { cn } from '@/lib/cn'
import { MethodBadge } from '@/components/ui/MethodBadge'
import { SlantRow } from '@/components/ui/SlantRow'
import { statusColor } from '@/lib/http-meta'
import { formatClock } from '@/lib/format'
import { shortPath, type HistoryRun } from '@/lib/history'

interface HistoryRowProps {
  run: HistoryRun
  onOpen(): void
}

/** Sidebar row. A repeated run shows a count instead of stacking duplicates. */
export function HistoryRow({ run, onOpen }: HistoryRowProps) {
  const { entry, count } = run
  const color = entry.status == null ? 'var(--color-crimson-hot)' : statusColor(entry.status)

  return (
    <SlantRow
      onClick={onOpen}
      title={`${entry.method} ${entry.url} · ${formatClock(entry.createdAt)}${count > 1 ? ` · ${count} runs` : ''}`}
      leading={<MethodBadge method={entry.method} size="xs" />}
      trailing={
        <span className="flex items-center gap-1.5">
          {count > 1 && (
            <span className="font-mono text-[9px] font-bold text-bone-4">&times;{count}</span>
          )}
          <span className={cn('font-mono text-[9.5px] font-bold tabular-nums')} style={{ color }}>
            {entry.status ?? 'ERR'}
          </span>
        </span>
      }
    >
      <span className="type-mono text-[11px] text-bone-3">{shortPath(entry.url)}</span>
    </SlantRow>
  )
}
