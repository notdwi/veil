import { cn } from '@/lib/cn'
import type { LayoutMode } from '@/lib/prefs'

interface LayoutPickerProps {
  value: LayoutMode
  onChange(layout: LayoutMode): void
}

const OPTIONS: { id: LayoutMode; label: string; hint: string }[] = [
  { id: 'stacked', label: 'Response below', hint: 'Wide bodies, tall JSON' },
  { id: 'split', label: 'Response right', hint: 'Side-by-side comparison' },
]

/** Miniature of the panel arrangement — the sidebar, request and response. */
function Diagram({ mode, active }: { mode: LayoutMode; active: boolean }) {
  const request = active ? 'var(--color-bone-3)' : 'var(--color-ink-4)'
  const response = active ? 'var(--color-crimson)' : 'var(--color-bone-4)'

  return (
    <svg viewBox="0 0 88 56" className="h-[56px] w-[88px]" aria-hidden>
      <rect x="0" y="0" width="88" height="56" fill="var(--color-ink)" />
      <rect x="0" y="0" width="20" height="56" fill={request} opacity="0.35" />
      {mode === 'stacked' ? (
        <>
          <rect x="23" y="3" width="62" height="23" fill={request} opacity="0.6" />
          <rect x="23" y="29" width="62" height="24" fill={response} />
        </>
      ) : (
        <>
          <rect x="23" y="3" width="30" height="50" fill={request} opacity="0.6" />
          <rect x="56" y="3" width="29" height="50" fill={response} />
        </>
      )}
    </svg>
  )
}

export function LayoutPicker({ value, onChange }: LayoutPickerProps) {
  return (
    <div className="flex gap-2.5">
      {OPTIONS.map((option) => {
        const active = option.id === value
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            aria-pressed={active}
            className={cn(
              'clip-nick-tr group relative flex flex-1 flex-col gap-2 p-3 text-left',
              'transition-[background-color,transform] duration-(--t-tick) ease-(--ease-snap)',
              active
                ? 'bg-ink-4 shadow-[inset_0_0_0_1px_var(--color-crimson)]'
                : 'bg-ink-3 shadow-[inset_0_0_0_1px_var(--color-hairline)] hover:-translate-y-px hover:bg-ink-4',
            )}
          >
            <Diagram mode={option.id} active={active} />
            <span className={cn('type-label', active ? 'text-bone' : 'text-bone-3')}>
              {option.label}
            </span>
            <span className="text-[10px] leading-tight text-bone-4">{option.hint}</span>
            {active && (
              <span aria-hidden className="absolute right-2 top-2 h-[7px] w-[7px] skew-bar bg-crimson" />
            )}
          </button>
        )
      })}
    </div>
  )
}
