import { ArrowRight } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { collapseRuns } from '@/lib/history'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { useRequestStore } from '@/stores/useRequestStore'
import { useUiStore } from '@/stores/useUiStore'
import { HistoryRow } from './HistoryRow'

const PREVIEW = 5

/** Sidebar preview only. The full log lives in the history panel. */
export function HistoryList() {
  const entries = useHistoryStore((s) => s.entries)
  const load = useRequestStore((s) => s.load)
  const openPanel = useUiStore((s) => s.setHistoryPanelOpen)

  if (!entries.length) {
    return <EmptyState compact title="No runs" hint="Executed requests land here" />
  }

  const runs = collapseRuns(entries).slice(0, PREVIEW)

  return (
    <div className="pb-1">
      <div className="stagger">
        {runs.map((run) => (
          <HistoryRow key={run.entry.id} run={run} onOpen={() => load(run.entry.snapshot)} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => openPanel(true)}
        className="group mt-1 flex h-[22px] w-full items-center gap-1.5 pl-2 type-label text-bone-4 transition-[color,transform] duration-(--t-tick) ease-(--ease-snap) hover:translate-x-[3px] hover:text-crimson-hot"
      >
        <ArrowRight size={11} strokeWidth={2.6} />
        View all
        <span className="font-mono text-[9px] normal-case tracking-normal">({entries.length})</span>
      </button>
    </div>
  )
}
