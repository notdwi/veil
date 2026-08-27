import { EmptyState } from '@/components/ui/EmptyState'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { useRequestStore } from '@/stores/useRequestStore'
import { HistoryRow } from './HistoryRow'

interface HistoryListProps {
  limit?: number
}

export function HistoryList({ limit = 30 }: HistoryListProps) {
  const entries = useHistoryStore((s) => s.entries)
  const load = useRequestStore((s) => s.load)

  if (!entries.length) {
    return <EmptyState compact title="No runs" hint="Executed requests land here" />
  }

  return (
    <div className="stagger pb-1">
      {entries.slice(0, limit).map((entry) => (
        <HistoryRow key={entry.id} entry={entry} onOpen={() => load(entry.snapshot)} />
      ))}
    </div>
  )
}
