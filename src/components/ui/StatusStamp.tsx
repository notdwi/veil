import { cn } from '@/lib/cn'
import { statusColor, statusLabel } from '@/lib/http-meta'

interface StatusStampProps {
  status: number
  statusText?: string
  className?: string
}

/** Big status readout: numeral in colour, label in caps, hairline underscore. */
export function StatusStamp({ status, statusText, className }: StatusStampProps) {
  const color = statusColor(status)
  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span
        className="type-display text-[26px] leading-none"
        style={{ color, transform: 'skewX(-8deg)' }}
      >
        {status}
      </span>
      <span className="type-label pb-[3px]" style={{ color }}>
        {statusLabel(status, statusText)}
      </span>
    </div>
  )
}
