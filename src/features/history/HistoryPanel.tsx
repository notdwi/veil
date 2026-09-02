import { useMemo, useState } from 'react'
import { Eraser } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { GhostButton } from '@/components/ui/GhostButton'
import { Modal } from '@/components/ui/Modal'
import { EMPTY_FILTER, filterHistory, methodsPresent, type HistoryFilter } from '@/lib/history'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { useRequestStore } from '@/stores/useRequestStore'
import { useUiStore } from '@/stores/useUiStore'
import { HistoryFilters } from './HistoryFilters'
import { HISTORY_COLUMNS, HistoryTableRow } from './HistoryTableRow'

export function HistoryPanel() {
  const open = useUiStore((s) => s.historyPanelOpen)
  const setOpen = useUiStore((s) => s.setHistoryPanelOpen)
  const entries = useHistoryStore((s) => s.entries)
  const remove = useHistoryStore((s) => s.remove)
  const clear = useHistoryStore((s) => s.clear)
  const load = useRequestStore((s) => s.load)

  const [filter, setFilter] = useState<HistoryFilter>(EMPTY_FILTER)

  const methods = useMemo(() => methodsPresent(entries), [entries])
  const rows = useMemo(() => filterHistory(entries, filter), [entries, filter])

  const openEntry = (id: string) => {
    const entry = entries.find((e) => e.id === id)
    if (!entry) return
    load(entry.snapshot)
    setOpen(false)
  }

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="History"
      width={880}
      footer={
        <>
          <span className="mr-auto type-label text-[8.5px] text-bone-4">
            {rows.length === entries.length
              ? `${entries.length} runs`
              : `${rows.length} of ${entries.length} runs`}
          </span>
          <GhostButton onClick={() => void clear()} disabled={!entries.length}>
            <Eraser size={11} strokeWidth={2.2} />
            Clear all
          </GhostButton>
          <GhostButton tone="crimson" onClick={() => setOpen(false)}>
            Done
          </GhostButton>
        </>
      }
    >
      {!entries.length ? (
        <EmptyState title="No runs" hint="Execute a request and it lands here." />
      ) : (
        <>
          <HistoryFilters
            filter={filter}
            methods={methods}
            onChange={(patch) => setFilter((f) => ({ ...f, ...patch }))}
          />

          <div
            className="mt-4 grid items-center gap-x-3 border-b border-hairline pr-1 pl-1 pb-1.5"
            style={{ gridTemplateColumns: HISTORY_COLUMNS }}
          >
            <span className="type-label text-bone-4">Request</span>
            <span className="type-label text-right text-bone-4">Status</span>
            <span className="type-label text-right text-bone-4">Time</span>
            <span className="type-label text-right text-bone-4">When</span>
            <span />
          </div>

          {rows.length ? (
            <div>
              {rows.map((entry) => (
                <HistoryTableRow
                  key={entry.id}
                  entry={entry}
                  onOpen={() => openEntry(entry.id)}
                  onDelete={() => void remove([entry.id])}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              compact
              title="No match"
              hint="Nothing in the log matches these filters"
              className="mt-4"
            />
          )}
        </>
      )}
    </Modal>
  )
}
