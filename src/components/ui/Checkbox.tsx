import { cn } from '@/lib/cn'

interface CheckboxProps {
  checked: boolean
  onChange(next: boolean): void
  label?: string
  className?: string
}

/** Angular checkbox — a filled notched square with a hand-cut tick. */
export function Checkbox({ checked, onChange, label, className }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn('group grid h-[22px] w-[22px] place-items-center', className)}
    >
      <span
        className={cn(
          'clip-nick-tr grid h-[13px] w-[13px] place-items-center transition-colors duration-(--t-tick)',
          checked
            ? 'bg-crimson'
            : 'bg-transparent shadow-[inset_0_0_0_1.5px_var(--color-ink-4)] group-hover:shadow-[inset_0_0_0_1.5px_var(--color-bone-4)]',
        )}
        style={{ ['--nick' as string]: '4px' }}
      >
        {checked && (
          <svg viewBox="0 0 10 10" className="h-[8px] w-[8px]" aria-hidden>
            <path d="M1 5.2L3.7 8L9 1.6" stroke="var(--color-bone)" strokeWidth="2" fill="none" />
          </svg>
        )}
      </span>
    </button>
  )
}
