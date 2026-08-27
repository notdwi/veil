import { cn } from '@/lib/cn'

export interface TabItem<T extends string> {
  id: T
  label: string
  /** Small trailing count, e.g. active param rows. */
  badge?: number | string
}

interface SkewTabsProps<T extends string> {
  items: TabItem<T>[]
  value: T
  onChange(value: T): void
  className?: string
  size?: 'sm' | 'md'
}

/** Slanted tab rail. The active slab carries a crimson offset shadow. */
export function SkewTabs<T extends string>({
  items,
  value,
  onChange,
  className,
  size = 'md',
}: SkewTabsProps<T>) {
  return (
    <div role="tablist" className={cn('flex items-end gap-[3px]', className)}>
      {items.map((item) => {
        const active = item.id === value
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cn(
              'skew-bar relative isolate transition-[transform,background-color] duration-(--t-tick)',
              size === 'sm' ? 'h-[22px] px-3' : 'h-[26px] px-4',
              active
                ? 'bg-bone text-ink'
                : 'bg-ink-3 text-bone-3 hover:-translate-y-px hover:bg-ink-4 hover:text-bone',
            )}
          >
            {active && (
              <span
                aria-hidden
                className="absolute inset-0 -z-10 translate-x-[3px] translate-y-[3px] bg-crimson"
              />
            )}
            <span className="unskew flex items-center gap-1.5">
              <span className={cn('type-label', size === 'sm' && 'text-[9px]')}>{item.label}</span>
              {item.badge != null && item.badge !== 0 && (
                <span
                  className={cn(
                    'font-mono text-[9px] font-bold leading-none',
                    active ? 'text-crimson' : 'text-bone-4',
                  )}
                >
                  {item.badge}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
