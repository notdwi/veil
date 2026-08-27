import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

interface TextFieldProps extends ComponentPropsWithoutRef<'input'> {
  mono?: boolean
  invalid?: boolean
  bare?: boolean
}

/** Flat input with an underline that strikes crimson on focus. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { mono = true, invalid, bare, className, ...rest },
  ref,
) {
  return (
    <div className={cn('group relative flex-1', bare ? '' : 'bg-ink-2/60')}>
      <input
        ref={ref}
        spellCheck={false}
        autoComplete="off"
        className={cn(
          'peer h-full w-full bg-transparent px-2.5 py-1.5 text-bone placeholder:text-bone-4',
          mono ? 'type-mono' : 'text-[12.5px]',
          'focus:outline-none',
          className,
        )}
        {...rest}
      />
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-px',
          invalid ? 'bg-crimson' : 'bg-hairline',
        )}
      />
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-crimson',
          'transition-transform duration-(--t-tick) ease-(--ease-cut) peer-focus:scale-x-100',
        )}
      />
    </div>
  )
})
