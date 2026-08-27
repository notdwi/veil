import { cn } from '@/lib/cn'
import { methodColor } from '@/lib/http-meta'
import type { HttpMethod } from '@/types'

interface MethodBadgeProps {
  method: HttpMethod
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

const SIZE = {
  xs: 'h-[14px] min-w-[38px] text-[8.5px] px-1',
  sm: 'h-[18px] min-w-[50px] text-[9.5px] px-1.5',
  md: 'h-[26px] min-w-[66px] text-[11px] px-2',
} as const

/** Colour-coded, skewed method chip. Colour is the only cue that is not red. */
export function MethodBadge({ method, size = 'sm', className }: MethodBadgeProps) {
  const color = methodColor(method)
  return (
    <span
      className={cn('skew-bar inline-grid place-items-center', SIZE[size], className)}
      style={{ background: color }}
    >
      <span className="unskew type-label text-ink" style={{ letterSpacing: '0.1em' }}>
        {method}
      </span>
    </span>
  )
}
