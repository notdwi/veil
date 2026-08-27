import { cn } from '@/lib/cn'
import { useUiStore } from '@/stores/useUiStore'

const TONE = {
  info: 'bg-bone text-ink',
  good: 'bg-jade text-ink',
  bad: 'bg-crimson text-bone',
} as const

export function Toasts() {
  const toasts = useUiStore((s) => s.toasts)
  const dismiss = useUiStore((s) => s.dismissToast)

  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-1.5">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={cn(
            'skew-bar anim-slash pointer-events-auto max-w-[520px] px-4 py-1.5 shadow-[var(--shadow-lift)]',
            TONE[t.tone],
          )}
        >
          <span className="unskew block type-label leading-[1.4]">{t.message}</span>
        </button>
      ))}
    </div>
  )
}
