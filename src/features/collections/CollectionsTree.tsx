import { useState } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'
import { GhostButton } from '@/components/ui/GhostButton'
import { PromptModal } from '@/components/ui/PromptModal'
import { useCollectionsStore } from '@/stores/useCollectionsStore'
import { useRequestStore } from '@/stores/useRequestStore'
import { CollectionRow } from './CollectionRow'
import { RequestRow } from './RequestRow'

type Dialog = { kind: 'rename'; id: string; value: string } | null

interface CollectionsTreeProps {
  onCreate(): void
}

export function CollectionsTree({ onCreate }: CollectionsTreeProps) {
  const { collections, requests, collapsed, toggleCollapsed, renameCollection, deleteCollection, deleteRequest } =
    useCollectionsStore()
  const activeId = useRequestStore((s) => s.draft.id)
  const load = useRequestStore((s) => s.load)
  const [dialog, setDialog] = useState<Dialog>(null)

  if (!collections.length) {
    return (
      <EmptyState
        compact
        title="Empty"
        hint="No collections yet"
        action={
          <GhostButton size="xs" tone="crimson" onClick={onCreate}>
            Create
          </GhostButton>
        }
      />
    )
  }

  return (
    <div className="stagger pb-1">
      {collections.map((collection) => {
        const items = requests.filter((r) => r.collectionId === collection.id)
        const isCollapsed = collapsed[collection.id]
        return (
          <div key={collection.id}>
            <CollectionRow
              collection={collection}
              count={items.length}
              collapsed={!!isCollapsed}
              onToggle={() => toggleCollapsed(collection.id)}
              onRename={() => setDialog({ kind: 'rename', id: collection.id, value: collection.name })}
              onDelete={() => void deleteCollection(collection.id)}
            />
            {!isCollapsed &&
              items.map((request) => (
                <RequestRow
                  key={request.id}
                  request={request}
                  active={request.id === activeId}
                  onOpen={() => load(request)}
                  onDelete={() => void deleteRequest(request.id)}
                />
              ))}
            {!isCollapsed && !items.length && (
              <p className="py-1 pl-[34px] text-[10px] italic text-bone-4">no requests yet</p>
            )}
          </div>
        )
      })}

      <PromptModal
        open={dialog?.kind === 'rename'}
        title="Rename collection"
        initialValue={dialog?.value ?? ''}
        confirmLabel="Rename"
        onConfirm={(name) => dialog && void renameCollection(dialog.id, name)}
        onClose={() => setDialog(null)}
      />
    </div>
  )
}
