import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface GhostButtonProps extends ComponentPropsWithoutRef<'button'> {
  children: ReactNode
  tone?: 'default' | 'crimson'
  size?: 'xs' | 'sm'
}

/** Secondary action: a hairline slab that fills on hover. */
export function GhostButton({
  children,
  tone = 'default',
  size = 'sm',
  className,
  ...rest
}: GhostButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'clip-nick-tr group relative type-label inline-flex items-center gap-1.5',
        'shadow-[inset_0_0_0_1px_var(--color-hairline)]',
        'transition-[background-color,color,transform,box-shadow] duration-(--t-tick)',
        'hover:-translate-y-px active:translate-y-0',
        'disabled:pointer-events-none disabled:opacity-35',
        size === 'xs' ? 'h-[20px] px-2 text-[9px]' : 'h-[24px] px-2.5',
        tone === 'crimson'
          ? 'bg-crimson-ghost text-crimson-hot hover:bg-crimson hover:text-bone hover:shadow-[inset_0_0_0_1px_var(--color-crimson)]'
          : 'bg-ink-3 text-bone-2 hover:bg-bone hover:text-ink hover:shadow-[inset_0_0_0_1px_var(--color-bone)]',
        className,
      )}
      style={{ ['--nick' as string]: '6px' }}
      {...rest}
    >
      {children}
    </button>
  )
}
