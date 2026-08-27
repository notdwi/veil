import { cn } from '@/lib/cn'
import type { Phase } from '@/stores/useRequestStore'

interface ExecuteButtonProps {
  phase: Phase
  disabled?: boolean
  onClick(): void
}

/** The single loudest control in the app: a stacked, leaning crimson plate. */
export function ExecuteButton({ phase, disabled, onClick }: ExecuteButtonProps) {
  const sending = phase === 'sending'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || sending}
      aria-label="Execute request"
      className={cn(
        'group relative h-[40px] w-[168px] shrink-0 select-none',
        'disabled:cursor-not-allowed',
        disabled && !sending && 'opacity-40',
      )}
    >
      {/* Back plate — drifts further out on hover to deepen the parallax. */}
      <span
        aria-hidden
        className={cn(
          'skew-bar absolute inset-0 translate-x-[6px] translate-y-[5px] transition-transform duration-(--t-fast) ease-(--ease-snap)',
          sending ? 'bg-ink-4' : 'bg-bone',
          !disabled && !sending && 'group-hover:translate-x-[9px] group-hover:translate-y-[8px]',
          'group-active:translate-x-[3px] group-active:translate-y-[2px]',
        )}
      />

      <span
        aria-hidden
        className={cn(
          'skew-bar absolute inset-0 overflow-hidden transition-[transform,background-color] duration-(--t-fast) ease-(--ease-snap)',
          sending ? 'bg-ink-3' : 'bg-crimson',
          !disabled && !sending && 'group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:bg-crimson-hot',
          'group-active:translate-x-[3px] group-active:translate-y-[2px]',
        )}
      >
        {sending ? (
          <span className="hatch absolute inset-[-40%] text-crimson/45 anim-sweep" />
        ) : (
          <span className="absolute inset-y-0 -left-1/3 w-1/3 bg-bone/25 opacity-0 transition-opacity duration-(--t-tick) group-hover:opacity-100 group-hover:anim-sweep" />
        )}
      </span>

      <span
        className={cn(
          'relative flex h-full items-center justify-center gap-2 type-display',
          sending ? 'text-crimson-hot' : 'text-bone',
        )}
        style={{ transform: 'skewX(-9deg)' }}
      >
        <span className={cn('text-[18px]', sending && 'text-[14px] tracking-[0.06em]')}>
          {sending ? 'SENDING' : 'EXECUTE'}
        </span>
        {sending ? (
          <span className="flex gap-[3px]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-[3px] w-[7px] bg-crimson-hot"
                style={{ animation: `tick-blink 620ms ${i * 140}ms infinite steps(1)` }}
              />
            ))}
          </span>
        ) : (
          <svg viewBox="0 0 16 12" className="h-[11px] w-[15px]" aria-hidden fill="currentColor">
            <path d="M0 0l6 6-6 6V0z" opacity="0.55" />
            <path d="M8 0l6 6-6 6V0z" />
          </svg>
        )}
      </span>
    </button>
  )
}
