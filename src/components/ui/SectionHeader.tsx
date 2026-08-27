import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Tag } from './Tag'

interface SectionHeaderProps {
  label: string
  open: boolean
  onToggle(): void
  count?: number
  actions?: ReactNode
  className?: string
}

export function SectionHeader({ label, open, onToggle, count, actions, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex h-[28px] items-center gap-1.5 pr-1.5 pl-1', className)}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
      >
        <ChevronRight
          size={11}
          strokeWidth={3}
          className={cn(
            'shrink-0 text-bone-4 transition-transform duration-(--t-tick) ease-(--ease-snap)',
            open && 'rotate-90',
          )}
        />
        <Tag size="sm">{label}</Tag>
        {count != null && count > 0 && (
          <span className="font-mono text-[9.5px] font-bold text-bone-4">{count}</span>
        )}
      </button>
      <div className="flex items-center gap-0.5 opacity-0 transition-opacity duration-(--t-tick) focus-within:opacity-100 group-hover/side:opacity-100">
        {actions}
      </div>
    </div>
  )
}
