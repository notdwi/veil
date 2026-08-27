import { cn } from '@/lib/cn'

type Corner = 'br' | 'bl' | 'tr' | 'bc'

interface BleedTitleProps {
  children: string
  className?: string
  /** Anchor for the oversized word. `bc` keeps it on the panel's centre axis. */
  corner?: Corner
}

const ANCHOR: Record<Corner, string> = {
  br: 'right-[-3%] bottom-[-14%] origin-bottom-right',
  bl: 'left-[-3%] bottom-[-14%] origin-bottom-left',
  tr: 'right-[-3%] top-[-14%] origin-top-right',
  bc: 'left-1/2 bottom-[22px] origin-bottom',
}

const SKEW = 'skewX(-11deg)'

/** The oversized watermark word. Purely typographic, sits under all content. */
export function BleedTitle({ children, className, corner = 'br' }: BleedTitleProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute z-0 select-none type-display whitespace-nowrap',
        'text-bone/[0.016]',
        ANCHOR[corner],
        className,
      )}
      style={{
        fontSize: 'clamp(44px, 15cqw, 148px)',
        transform: corner === 'bc' ? `translateX(-50%) ${SKEW}` : SKEW,
      }}
    >
      {children}
    </div>
  )
}
