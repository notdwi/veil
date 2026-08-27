import { cn } from '@/lib/cn'
import { VeilMark } from './VeilMark'

interface WordmarkProps {
  className?: string
  scale?: number
  withMark?: boolean
}

/** Wordmark lockup: the mark and the name. Nothing decorative between them. */
export function Wordmark({ className, scale = 1, withMark = true }: WordmarkProps) {
  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      {withMark && <VeilMark size={22 * scale} />}
      <span
        className="type-display text-bone"
        style={{
          fontSize: 20 * scale,
          letterSpacing: '0.13em',
          transform: 'skewX(-9deg)',
        }}
      >
        VEIL
      </span>
    </div>
  )
}
