import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import { extractTokens } from '@/lib/interpolate'
import { hasScheme, inferScheme } from '@/lib/url'
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
  // Surfaced rather than silently prepended, so the sent URL is never a surprise.
  const implied = value.trim() && !hasScheme(value) ? `${inferScheme(value)}://` : null

  useEffect(() => {
    if (signal > 0) {
      ref.current?.focus()
      ref.current?.select()
    }
  }, [signal])

  return (
    <div className="group relative flex min-w-[200px] flex-1 flex-col justify-center bg-ink-2/70">
      <div className="flex h-[40px] items-center">
        {implied && (
          <span
            aria-hidden
            className="shrink-0 pl-3.5 font-mono text-[14px] tracking-[-0.01em] text-bone-4"
          >
            {implied}
          </span>
        )}
        <input
          ref={ref}
          value={value}
          spellCheck={false}
          autoComplete="off"
          placeholder="api.example.com/resource"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              onSubmit()
            }
          }}
          className={cn(
            'h-full min-w-0 flex-1 bg-transparent font-mono text-[14px] tracking-[-0.01em] text-bone placeholder:text-bone-4',
            implied ? 'pr-3.5 pl-0' : 'px-3.5',
          )}
        />
      </div>
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
