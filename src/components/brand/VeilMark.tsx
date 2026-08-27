import { useId } from 'react'
import { cn } from '@/lib/cn'

interface VeilMarkProps {
  size?: number
  className?: string
}

/** The VEIL mark: one disc parted by a single leaning slit. Nothing else. */
export function VeilMark({ size = 24, className }: VeilMarkProps) {
  const mask = useId().replace(/:/g, '')

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden
      className={cn('shrink-0', className)}
    >
      <mask id={mask}>
        <rect width="32" height="32" fill="#fff" />
        <path d="M16.8 -1 L20.1 -1 L15.3 33 L12.0 33 Z" fill="#000" />
      </mask>
      <circle cx="16" cy="16" r="13" className="fill-crimson" mask={`url(#${mask})`} />
    </svg>
  )
}
