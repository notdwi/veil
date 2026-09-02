import { Search, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { methodColor } from '@/lib/http-meta'
import type { HistoryFilter, StatusClass } from '@/lib/history'
import type { HttpMethod } from '@/types'

interface HistoryFiltersProps {
  filter: HistoryFilter
  methods: HttpMethod[]
  onChange(patch: Partial<HistoryFilter>): void
}

const STATUS_CLASSES: { id: StatusClass; label: string; color: string }[] = [
  { id: 'all', label: 'All', color: 'var(--color-bone-2)' },
  { id: '2xx', label: '2xx', color: 'var(--color-jade)' },
  { id: '3xx', label: '3xx', color: 'var(--color-azure)' },
  { id: '4xx', label: '4xx', color: 'var(--color-amber)' },
  { id: '5xx', label: '5xx', color: 'var(--color-crimson-hot)' },
  { id: 'err', label: 'Err', color: 'var(--color-crimson-hot)' },
]

function Chip({
  active,
  color,
  children,
  onClick,
}: {
  active: boolean
  color: string
  children: React.ReactNode
  onClick(): void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'skew-bar h-[20px] px-2.5 transition-[background-color,transform] duration-(--t-tick) ease-(--ease-snap)',
        active ? 'bg-bone' : 'bg-ink-3 hover:-translate-y-px hover:bg-ink-4',
      )}
    >
      <span
        className="unskew block type-label text-[9px]"
        style={{ color: active ? 'var(--color-ink)' : color }}
      >
        {children}
      </span>
    </button>
  )
}

export function HistoryFilters({ filter, methods, onChange }: HistoryFiltersProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="group relative flex items-center gap-2 bg-ink-3 px-2.5">
        <Search size={12} strokeWidth={2.4} className="shrink-0 text-crimson" />
        <input
          autoFocus
          value={filter.query}
          spellCheck={false}
          placeholder="Filter by method, path or status…"
          onChange={(e) => onChange({ query: e.target.value })}
          className="h-[28px] w-full bg-transparent type-mono text-bone placeholder:text-bone-4"
        />
        {filter.query && (
          <button
            type="button"
            aria-label="Clear filter"
            onClick={() => onChange({ query: '' })}
            className="shrink-0 text-bone-4 transition-colors duration-(--t-tick) hover:text-bone"
          >
            <X size={12} strokeWidth={2.4} />
          </button>
        )}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-crimson transition-transform duration-(--t-tick) ease-(--ease-cut) group-focus-within:scale-x-100"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        <Chip
          active={filter.method === 'all'}
          color="var(--color-bone-2)"
          onClick={() => onChange({ method: 'all' })}
        >
          All
        </Chip>
        {methods.map((method) => (
          <Chip
            key={method}
            active={filter.method === method}
            color={methodColor(method)}
            onClick={() => onChange({ method })}
          >
            {method}
          </Chip>
        ))}

        <span aria-hidden className="mx-1 h-[14px] w-px bg-hairline" />

        {STATUS_CLASSES.map((sc) => (
          <Chip
            key={sc.id}
            active={filter.statusClass === sc.id}
            color={sc.color}
            onClick={() => onChange({ statusClass: sc.id })}
          >
            {sc.label}
          </Chip>
        ))}
      </div>
    </div>
  )
}
