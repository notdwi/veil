import { useId } from 'react'
import { cn } from '@/lib/cn'

interface ShardsProps {
  className?: string
  tone?: 'crimson' | 'bone'
  /** Fades the field out toward this edge so it never reads as a flat wash. */
  fade?: 'b' | 't' | 'none'
}

const FADE = {
  b: 'linear-gradient(180deg, #000 0%, transparent 78%)',
  t: 'linear-gradient(0deg, #000 0%, transparent 78%)',
  none: undefined,
} as const

/** Tiled angular confetti. Tiling keeps the shapes crisp at any panel size. */
export function Shards({ className, tone = 'crimson', fade = 'b' }: ShardsProps) {
  const id = useId().replace(/:/g, '')
  const fill = tone === 'crimson' ? 'var(--color-crimson)' : 'var(--color-bone)'
  const mask = FADE[fade]

  return (
    <svg
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      style={mask ? { WebkitMaskImage: mask, maskImage: mask } : undefined}
    >
      <defs>
        <pattern
          id={id}
          width="196"
          height="152"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-11)"
        >
          <g fill={fill}>
            <path d="M14 16l24-5-7 21-20 3z" opacity="0.55" />
            <path d="M124 62l17-4-5 16-15 2z" opacity="0.4" />
            <path d="M68 112l13-3-4 13-12 2z" opacity="0.3" />
            <path d="M170 20l10-2-3 9-9 1z" opacity="0.22" />
          </g>
          <g stroke={fill} strokeWidth="1" fill="none">
            <path d="M-24 152L58 -8" opacity="0.2" />
            <path d="M112 152L196 -8" opacity="0.13" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
