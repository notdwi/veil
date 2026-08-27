import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface TagProps {
  children: ReactNode
  className?: string
  tone?: 'bone' | 'crimson' | 'outline'
  size?: 'sm' | 'md'
}

const TONE = {
  bone: 'bg-bone text-ink',
  crimson: 'bg-crimson text-bone',
  outline: 'bg-ink-2 text-bone-2 shadow-[inset_0_0_0_1px_var(--color-hairline)]',
} as const

/** The pointed cut-out label. The workhorse of every section heading. */
export function Tag({ children, className, tone = 'bone', size = 'md' }: TagProps) {
  return (
    <span
      className={cn(
        'clip-tag inline-flex items-center type-label',
        size === 'sm' ? 'h-[16px] pr-[15px] pl-2 text-[9px]' : 'h-[19px] pr-[18px] pl-2.5',
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
