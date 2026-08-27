import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import { extractTokens } from '@/lib/interpolate'
import { useUiStore } from '@/stores/useUiStore'

interface UrlInputProps {
  value: string
  onChange(value: string): void
  onSubmit(): void
  unresolved: string[]
}

/** The URL is the loudest editable text in the app: large mono, crimson caret. */
export function UrlInput({ value, onChange, onSubmit, unresolved }: UrlInputProps) {
  const ref = useRef<HTMLInputElement>(null)
  const signal = useUiStore((s) => s.urlFocusSignal)
  const tokens = extractTokens(value)

  useEffect(() => {
    if (signal > 0) {
      ref.current?.focus()
      ref.current?.select()
    }
  }, [signal])

  return (
    <div className="group relative flex min-w-[200px] flex-1 flex-col justify-center bg-ink-2/70">
      <input
        ref={ref}
        value={value}
        spellCheck={false}
        autoComplete="off"
        placeholder="https://api.example.com/resource"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSubmit()
          }
        }}
        className="h-[40px] w-full bg-transparent px-3.5 font-mono text-[14px] tracking-[-0.01em] text-bone placeholder:text-bone-4"
      />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-hairline" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-crimson transition-transform duration-(--t-fast) ease-(--ease-cut) group-focus-within:scale-x-100"
      />

      {tokens.length > 0 && (
        <div className="pointer-events-none absolute -bottom-[17px] left-3.5 flex items-center gap-1.5">
          {tokens.map((token) => {
            const missing = unresolved.includes(token)
            return (
              <span
                key={token}
                className={cn(
                  'type-label text-[8.5px]',
                  missing ? 'text-crimson-hot' : 'text-magenta',
                )}
              >
                {`{{${token}}}`}
                {missing && ' ?'}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
