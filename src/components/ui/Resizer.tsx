import { cn } from '@/lib/cn'
import { useDrag } from '@/hooks/useDrag'

interface ResizerProps {
  axis: 'x' | 'y'
  onDrag(position: number): void
  className?: string
}

/** 5px hit area, 1px visual. Turns crimson while dragging. */
export function Resizer({ axis, onDrag, className }: ResizerProps) {
  const { dragging, onPointerDown } = useDrag(axis, onDrag)
  const vertical = axis === 'x'

  return (
    <div
      role="separator"
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      onPointerDown={onPointerDown}
      className={cn(
        'group relative z-20 shrink-0',
        vertical ? 'w-[5px] cursor-col-resize' : 'h-[5px] cursor-row-resize',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute transition-colors duration-(--t-tick)',
          vertical ? 'inset-y-0 left-[2px] w-px' : 'inset-x-0 top-[2px] h-px',
          dragging ? 'bg-crimson' : 'bg-hairline group-hover:bg-crimson-deep',
        )}
      />
    </div>
  )
}
