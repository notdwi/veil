import { cn } from '@/lib/cn'

interface KeyHintProps {
  keys: string
  label?: string
  className?: string
  tone?: 'bone' | 'muted'
}

/** Mirrors the in-game key legend: solid chip, then the action in caps. */
export function KeyHint({ keys, label, className, tone = 'muted' }: KeyHintProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <kbd
        className={cn(
          'clip-nick-tr inline-flex h-[16px] items-center px-1.5 font-mono text-[9.5px] font-bold tracking-wider',
          tone === 'bone' ? 'bg-bone text-ink' : 'bg-ink-4 text-bone-2',
        )}
        style={{ ['--nick' as string]: '4px' }}
      >
        {keys}
      </kbd>
      {label && <span className="type-label text-bone-4">{label}</span>}
    </span>
  )
}
