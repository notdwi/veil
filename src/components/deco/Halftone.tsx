import { cn } from '@/lib/cn'

interface HalftoneProps {
  className?: string
  variant?: 'dots' | 'dots-lg' | 'hatch'
  fade?: 'r' | 'l' | 't' | 'b' | 'none'
}

const FADE: Record<string, string> = {
  r: 'linear-gradient(90deg, #000 0%, transparent 85%)',
  l: 'linear-gradient(270deg, #000 0%, transparent 85%)',
  t: 'linear-gradient(0deg, #000 0%, transparent 85%)',
  b: 'linear-gradient(180deg, #000 0%, transparent 85%)',
}

/** Print-texture wash. Always decorative, never interactive. */
export function Halftone({ className, variant = 'dots', fade = 'none' }: HalftoneProps) {
  const mask = fade === 'none' ? undefined : FADE[fade]
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0',
        variant === 'dots' && 'halftone',
        variant === 'dots-lg' && 'halftone-lg',
        variant === 'hatch' && 'hatch',
        className,
      )}
      style={mask ? { WebkitMaskImage: mask, maskImage: mask } : undefined}
    />
  )
}
