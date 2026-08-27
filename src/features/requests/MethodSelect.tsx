import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Popover } from '@/components/ui/Popover'
import { methodColor } from '@/lib/http-meta'
import { HTTP_METHODS, type HttpMethod } from '@/types'

interface MethodSelectProps {
  value: HttpMethod
  onChange(method: HttpMethod): void
}

export function MethodSelect({ value, onChange }: MethodSelectProps) {
  return (
    <Popover
      align="left"
      width={150}
      trigger={({ open, toggle }) => (
        <button
          type="button"
          onClick={toggle}
          aria-label="HTTP method"
          className={cn(
            'skew-bar relative flex h-[40px] w-[112px] shrink-0 items-center justify-between px-3',
            'transition-transform duration-(--t-tick) ease-(--ease-snap)',
            open ? 'translate-y-[1px]' : 'hover:-translate-y-[1px]',
          )}
          style={{ background: methodColor(value) }}
        >
          <span
            className="type-display text-[17px] text-ink"
            style={{ letterSpacing: '0.02em' }}
          >
            {value}
          </span>
          <ChevronDown
            size={13}
            strokeWidth={3}
            className={cn('text-ink/70 transition-transform duration-(--t-tick)', open && 'rotate-180')}
          />
        </button>
      )}
    >
      {(close) => (
        <div className="py-1">
          {HTTP_METHODS.map((method) => (
            <button
              key={method}
              onClick={() => {
                onChange(method)
                close()
              }}
              className={cn(
                'group flex w-full items-center gap-2.5 px-3 py-[5px] transition-colors duration-(--t-tick)',
                method === value ? 'bg-ink-4' : 'hover:bg-ink-3',
              )}
            >
              <span
                className="h-[13px] w-[3px] shrink-0 skew-bar"
                style={{ background: methodColor(method) }}
              />
              <span
                className="type-display text-[13px]"
                style={{ color: method === value ? methodColor(method) : 'var(--color-bone-2)' }}
              >
                {method}
              </span>
            </button>
          ))}
        </div>
      )}
    </Popover>
  )
}
