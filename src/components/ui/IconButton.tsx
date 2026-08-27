import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface IconButtonProps extends ComponentPropsWithoutRef<'button'> {
  children: ReactNode
  label: string
  active?: boolean
  tone?: 'default' | 'danger'
}

export function IconButton({
  children,
  label,
  active,
  tone = 'default',
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={cn(
        'clip-nick-tr grid h-[24px] w-[24px] place-items-center text-bone-3',
        'transition-[color,background-color,transform] duration-(--t-tick)',
        'hover:-translate-y-px hover:bg-ink-4 hover:text-bone',
        'active:translate-y-0 disabled:pointer-events-none disabled:opacity-35',
        active && 'bg-crimson text-bone hover:bg-crimson-hot hover:text-bone',
        tone === 'danger' && 'hover:bg-crimson-deep hover:text-bone',
        className,
      )}
      style={{ ['--nick' as string]: '5px' }}
      {...rest}
    >
      {children}
    </button>
  )
}
