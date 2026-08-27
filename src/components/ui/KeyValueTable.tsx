import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { hasTokens } from '@/lib/interpolate'
import { emptyRow } from '@/stores/defaults'
import type { KeyValue } from '@/types'
import { Checkbox } from './Checkbox'
import { IconButton } from './IconButton'
import { TextField } from './TextField'

interface KeyValueTableProps {
  rows: KeyValue[]
  onChange(rows: KeyValue[]): void
  keyPlaceholder?: string
  valuePlaceholder?: string
  maskValues?: boolean
  className?: string
}

/** Editable grid that always keeps one blank row at the bottom. */
export function KeyValueTable({
  rows,
  onChange,
  keyPlaceholder = 'key',
  valuePlaceholder = 'value',
  maskValues = false,
  className,
}: KeyValueTableProps) {
  const list = rows.length ? rows : [emptyRow()]

  const update = (id: string, patch: Partial<KeyValue>) => {
    const next = list.map((r) => (r.id === id ? { ...r, ...patch } : r))
    const last = next[next.length - 1]
    if (last.key || last.value) next.push(emptyRow())
    onChange(next)
  }

  const remove = (id: string) => {
    const next = list.filter((r) => r.id !== id)
    onChange(next.length ? next : [emptyRow()])
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="grid grid-cols-[26px_minmax(140px,0.9fr)_minmax(180px,1.6fr)_26px] items-center gap-x-1 border-b border-hairline pb-1.5">
        <span />
        <span className="type-label px-2.5 text-bone-4">Key</span>
        <span className="type-label px-2.5 text-bone-4">Value</span>
        <span />
      </div>

      <div className="stagger">
        {list.map((row, index) => {
          const blank = !row.key && !row.value
          return (
            <div
              key={row.id}
              className={cn(
                'group grid grid-cols-[26px_minmax(140px,0.9fr)_minmax(180px,1.6fr)_26px] items-center gap-x-1',
                'border-b border-hairline/50 transition-colors duration-(--t-tick) hover:bg-ink-2/70',
                blank && 'opacity-55 focus-within:opacity-100',
              )}
            >
              <Checkbox
                checked={row.enabled}
                onChange={(enabled) => update(row.id, { enabled })}
                label={`Toggle row ${index + 1}`}
                className={blank ? 'invisible group-focus-within:visible' : ''}
              />
              <TextField
                bare
                value={row.key}
                placeholder={keyPlaceholder}
                onChange={(e) => update(row.id, { key: e.target.value })}
                className={cn(!row.enabled && 'text-bone-4 line-through')}
              />
              <TextField
                bare
                type={maskValues && !hasTokens(row.value) ? 'password' : 'text'}
                value={row.value}
                placeholder={valuePlaceholder}
                onChange={(e) => update(row.id, { value: e.target.value })}
                className={cn(
                  !row.enabled && 'text-bone-4 line-through',
                  hasTokens(row.value) && 'text-magenta',
                )}
              />
              <IconButton
                label="Remove row"
                tone="danger"
                onClick={() => remove(row.id)}
                className={cn('opacity-0 group-hover:opacity-100', blank && 'invisible')}
              >
                <Trash2 size={12} strokeWidth={2.2} />
              </IconButton>
            </div>
          )
        })}
      </div>
    </div>
  )
}
