import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface PopoverProps {
  trigger(props: { open: boolean; toggle(): void }): ReactNode
  children(close: () => void): ReactNode
  align?: 'left' | 'right'
  width?: number
  className?: string
}

/** Minimal anchored panel: click-outside and Escape close it, nothing else. */
export function Popover({ trigger, children, align = 'right', width = 240, className }: PopoverProps) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={root} className="relative">
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open && (
        <div
          className={cn(
            'clip-nick-bl anim-drop absolute top-[calc(100%+6px)] z-40 overflow-hidden',
            'bg-ink-2 shadow-[0_0_0_1px_var(--color-hairline),var(--shadow-lift)]',
            align === 'right' ? 'right-0' : 'left-0',
            className,
          )}
          style={{ width }}
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-crimson" />
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}
