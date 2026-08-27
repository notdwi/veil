import { ChevronRight, FolderClosed, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { IconButton } from '@/components/ui/IconButton'
import { SlantRow } from '@/components/ui/SlantRow'
import type { Collection } from '@/types'

interface CollectionRowProps {
  collection: Collection
  count: number
  collapsed: boolean
  onToggle(): void
  onRename(): void
  onDelete(): void
}

export function CollectionRow({
  collection,
  count,
  collapsed,
  onToggle,
  onRename,
  onDelete,
}: CollectionRowProps) {
  return (
    <SlantRow
      onClick={onToggle}
      title={collection.name}
      leading={
        <span className="flex items-center gap-1">
          <ChevronRight
            size={10}
            strokeWidth={3}
            className={cn(
              'text-bone-4 transition-transform duration-(--t-tick) ease-(--ease-snap)',
              !collapsed && 'rotate-90',
            )}
          />
          <FolderClosed size={11} strokeWidth={2.2} className="text-crimson" />
        </span>
      }
      trailing={
        <span className="flex items-center gap-0.5">
          <span className="font-mono text-[9.5px] text-bone-4 group-hover:hidden">{count}</span>
          <span className="hidden items-center gap-0.5 group-hover:flex">
            <IconButton
              label="Rename collection"
              onClick={(e) => {
                e.stopPropagation()
                onRename()
              }}
            >
              <Pencil size={10} strokeWidth={2.2} />
            </IconButton>
            <IconButton
              label="Delete collection"
              tone="danger"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <Trash2 size={11} strokeWidth={2.2} />
            </IconButton>
          </span>
        </span>
      }
    >
      <span className="type-label text-[10px] tracking-[0.12em]">{collection.name}</span>
    </SlantRow>
  )
}
