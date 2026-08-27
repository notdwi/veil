import type { MouseEvent, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SlantRowProps {
  children: ReactNode
  leading?: ReactNode
  trailing?: ReactNode
  active?: boolean
  indent?: number
  title?: string
  className?: string
  onClick?(event: MouseEvent): void
  onDoubleClick?(event: MouseEvent): void
}

/** Shared list row. The slant lives in a background layer so labels stay upright. */
export function SlantRow({
  children,
  leading,
  trailing,
  active,
  indent = 0,
  title,
  className,
  onClick,
  onDoubleClick,
}: SlantRowProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      title={title}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(e as unknown as MouseEvent)
        }
      }}
      className={cn(
        'group relative isolate flex h-[26px] cursor-pointer items-center gap-2 pr-1.5',
        'transition-transform duration-(--t-tick) ease-(--ease-snap)',
        !active && 'hover:translate-x-[3px]',
        className,
      )}
      style={{ paddingLeft: 8 + indent * 12 }}
    >
      {active && (
        <>
          <span
            aria-hidden
            className="skew-bar absolute inset-y-0 -left-1 right-[-2px] -z-20 translate-x-[3px] translate-y-[2px] bg-crimson"
          />
          <span aria-hidden className="skew-bar absolute inset-y-0 -left-1 right-[-2px] -z-10 bg-bone" />
        </>
      )}
      {!active && (
        <span
          aria-hidden
          className="absolute inset-y-0 -left-1 right-0 -z-10 bg-ink-3 opacity-0 transition-opacity duration-(--t-tick) group-hover:opacity-100"
        />
      )}

      {leading}
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-[11.5px] leading-none',
          active ? 'font-semibold text-ink' : 'text-bone-2 group-hover:text-bone',
        )}
      >
        {children}
      </span>
      {trailing}
    </div>
  )
}
