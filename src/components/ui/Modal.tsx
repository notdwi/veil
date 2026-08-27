import { useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Halftone } from '@/components/deco/Halftone'
import { Tag } from './Tag'

interface ModalProps {
  open: boolean
  onClose(): void
  title: string
  children: ReactNode
  footer?: ReactNode
  width?: number
  className?: string
}

export function Modal({ open, onClose, title, children, footer, width = 560, className }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-8">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/86 backdrop-blur-[2px]"
      >
        <Halftone className="text-crimson/15" variant="dots-lg" />
      </button>

      <div
        role="dialog"
        aria-modal
        aria-label={title}
        className={cn(
          'clip-shard anim-pop relative flex max-h-[80vh] w-full flex-col overflow-hidden',
          'bg-ink-2 shadow-[0_0_0_1px_var(--color-hairline),var(--shadow-lift)]',
          className,
        )}
        style={{ maxWidth: width }}
      >
        <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-crimson" />

        <header className="flex items-center justify-between px-5 pt-4 pb-3">
          <Tag>{title}</Tag>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">{children}</div>

        {footer && (
          <footer className="flex items-center justify-end gap-2 border-t border-hairline px-5 py-3">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}
