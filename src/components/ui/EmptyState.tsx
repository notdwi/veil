import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Halftone } from '@/components/deco/Halftone'

interface EmptyStateProps {
  title: string
  hint?: string
  action?: ReactNode
  className?: string
  /** Sidebar variant: one tight block instead of a full-panel statement. */
  compact?: boolean
}

export function EmptyState({ title, hint, action, className, compact }: EmptyStateProps) {
  if (compact) {
    return (
      <div className={cn('flex items-center gap-2.5 py-2 pr-2 pl-3', className)}>
        <span className="type-display shrink-0 text-[15px] leading-none text-bone/15">{title}</span>
        <span aria-hidden className="h-[13px] w-px shrink-0 skew-bar bg-hairline" />
        {hint && <p className="min-w-0 flex-1 truncate text-[10px] text-bone-4">{hint}</p>}
        {action}
      </div>
    )
  }

  return (
    <div className={cn('relative grid place-items-center overflow-hidden px-6 py-14 text-center', className)}>
      <Halftone className="text-bone-4/25" fade="t" />
      <div className="relative z-10 flex flex-col items-center gap-2.5">
        <div className="type-display text-[40px] text-bone/10" style={{ transform: 'skewX(-10deg)' }}>
          {title}
        </div>
        {hint && <p className="max-w-[30ch] text-[11px] leading-snug text-bone-4">{hint}</p>}
        {action}
      </div>
    </div>
  )
}
