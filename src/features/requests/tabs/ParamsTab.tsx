import { KeyValueTable } from '@/components/ui/KeyValueTable'
import { useRequestStore } from '@/stores/useRequestStore'

export function ParamsTab() {
  const params = useRequestStore((s) => s.draft.params)
  const patch = useRequestStore((s) => s.patch)

  return (
    <KeyValueTable
      rows={params}
      onChange={(rows) => patch({ params: rows })}
      keyPlaceholder="page"
      className="max-w-[920px]"
      valuePlaceholder="1"
    />
  )
}
