import { useState } from 'react'
import { FilePlus2, FolderPlus, ListFilter, Plus } from 'lucide-react'
import { Halftone } from '@/components/deco/Halftone'
import { IconButton } from '@/components/ui/IconButton'
import { PromptModal } from '@/components/ui/PromptModal'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { CollectionsTree } from '@/features/collections/CollectionsTree'
import { HistoryList } from '@/features/history/HistoryList'
import { EnvList } from '@/features/environments/EnvList'
import { useCollectionsStore } from '@/stores/useCollectionsStore'
import { useEnvStore } from '@/stores/useEnvStore'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { useRequestStore } from '@/stores/useRequestStore'
import { useUiStore } from '@/stores/useUiStore'
import { APP_VERSION } from '@/lib/version'

type Dialog = 'collection' | 'environment' | null

export function Sidebar() {
  const { openSections, toggleSection } = useUiStore()
  const setHistoryPanelOpen = useUiStore((s) => s.setHistoryPanelOpen)
  const collections = useCollectionsStore((s) => s.collections)
  const createCollection = useCollectionsStore((s) => s.createCollection)
  const requestCount = useCollectionsStore((s) => s.requests.length)
  const historyCount = useHistoryStore((s) => s.entries.length)
  const environments = useEnvStore((s) => s.environments)
  const createEnvironment = useEnvStore((s) => s.create)
  const newRequest = useRequestStore((s) => s.reset)

  const [dialog, setDialog] = useState<Dialog>(null)

  return (
    <aside className="group/side relative flex h-full min-h-0 flex-col overflow-hidden bg-ink-2">
      <Halftone className="text-bone-4/[0.18]" fade="b" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto">
        <SectionHeader
          label="Collections"
          open={openSections.collections}
          onToggle={() => toggleSection('collections')}
          count={requestCount}
          actions={
            <>
              <IconButton label="New request" onClick={newRequest}>
                <FilePlus2 size={12} strokeWidth={2.2} />
              </IconButton>
              <IconButton label="New collection" onClick={() => setDialog('collection')}>
                <FolderPlus size={12} strokeWidth={2.2} />
              </IconButton>
            </>
          }
        />
        {openSections.collections && <CollectionsTree onCreate={() => setDialog('collection')} />}

        <span aria-hidden className="my-1 h-px shrink-0 rule-x" />

        <SectionHeader
          label="History"
          open={openSections.history}
          onToggle={() => toggleSection('history')}
          count={historyCount}
          actions={
            <IconButton label="Open history" onClick={() => setHistoryPanelOpen(true)}>
              <ListFilter size={12} strokeWidth={2.2} />
            </IconButton>
          }
        />
        {openSections.history && <HistoryList />}

        <span aria-hidden className="my-1 h-px shrink-0 rule-x" />

        <SectionHeader
          label="Environment"
          open={openSections.environment}
          onToggle={() => toggleSection('environment')}
          count={environments.length}
          actions={
            <IconButton label="New environment" onClick={() => setDialog('environment')}>
              <Plus size={13} strokeWidth={2.6} />
            </IconButton>
          }
        />
        {openSections.environment && <EnvList onCreate={() => setDialog('environment')} />}

        <div className="h-6 shrink-0" />
      </div>

      <footer className="relative z-10 flex h-[24px] shrink-0 items-center justify-between border-t border-hairline px-2.5">
        <span className="type-label text-[8.5px] text-bone-4">
          {collections.length} col · {requestCount} req
        </span>
        <span className="font-mono text-[8.5px] tracking-wider text-bone-4">v{APP_VERSION}</span>
      </footer>

      <PromptModal
        open={dialog === 'collection'}
        title="New collection"
        initialValue="Untitled"
        confirmLabel="Create"
        onConfirm={(name) => void createCollection(name)}
        onClose={() => setDialog(null)}
      />
      <PromptModal
        open={dialog === 'environment'}
        title="New environment"
        initialValue="Development"
        confirmLabel="Create"
        onConfirm={(name) => void createEnvironment(name)}
        onClose={() => setDialog(null)}
      />
    </aside>
  )
}
