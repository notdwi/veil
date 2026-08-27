import { KeyValueTable } from '@/components/ui/KeyValueTable'
import { useRequestStore } from '@/stores/useRequestStore'

export function HeadersTab() {
  const headers = useRequestStore((s) => s.draft.headers)
  const patch = useRequestStore((s) => s.patch)

  return (
    <KeyValueTable
      rows={headers}
      onChange={(rows) => patch({ headers: rows })}
      keyPlaceholder="Content-Type"
      className="max-w-[920px]"
      valuePlaceholder="application/json"
    />
  )
}
