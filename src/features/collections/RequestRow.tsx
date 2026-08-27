import { Trash2 } from 'lucide-react'
import { MethodBadge } from '@/components/ui/MethodBadge'
import { IconButton } from '@/components/ui/IconButton'
import { SlantRow } from '@/components/ui/SlantRow'
import type { RequestDraft } from '@/types'

interface RequestRowProps {
  request: RequestDraft
  active: boolean
  onOpen(): void
  onDelete(): void
}

export function RequestRow({ request, active, onOpen, onDelete }: RequestRowProps) {
  return (
    <SlantRow
      active={active}
      indent={1}
      title={request.url || request.name}
      onClick={onOpen}
      leading={<MethodBadge method={request.method} size="xs" />}
      trailing={
        <IconButton
          label="Delete request"
          tone="danger"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={11} strokeWidth={2.2} />
        </IconButton>
      }
    >
      {request.name}
    </SlantRow>
  )
}
