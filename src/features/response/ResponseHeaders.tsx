import { EmptyState } from '@/components/ui/EmptyState'

interface ResponseHeadersProps {
  headers: [string, string][]
}

export function ResponseHeaders({ headers }: ResponseHeadersProps) {
  if (!headers.length) return <EmptyState title="No headers" compact />

  return (
    <div className="stagger px-5 py-3">
      {headers.map(([key, value], i) => (
        <div
          key={`${key}-${i}`}
          className="grid grid-cols-[minmax(150px,0.6fr)_1fr] items-start gap-4 border-b border-hairline/50 py-[5px] transition-colors duration-(--t-tick) hover:bg-ink-2/70"
        >
          <span data-selectable className="type-mono truncate text-[11.5px] font-semibold text-bone">
            {key}
          </span>
          <span data-selectable className="type-mono break-all text-[11.5px] text-bone-3">
            {value}
          </span>
        </div>
      ))}
    </div>
  )
}
