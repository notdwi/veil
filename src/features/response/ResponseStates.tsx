import { Halftone } from '@/components/deco/Halftone'
import { Shards } from '@/components/deco/Shards'
import { KeyHint } from '@/components/ui/KeyHint'
import { formatDuration } from '@/lib/format'
import type { HttpFailure } from '@/types'

export function ResponseIdle() {
  return (
    <div className="relative h-full overflow-hidden">
      <Shards className="opacity-[0.13]" />
      <Halftone className="text-bone-4/15" fade="t" />
      <div className="relative z-10 flex h-full flex-col items-center justify-start gap-3 pt-[clamp(28px,12%,118px)]">
        <div
          className="type-display text-[46px] leading-none text-bone/[0.08]"
          style={{ transform: 'skewX(-10deg)' }}
        >
          STANDBY
        </div>
        <div className="flex items-center gap-2">
          <KeyHint keys="Ctrl ↵" label="Execute" />
          <KeyHint keys="Ctrl P" label="Commands" />
        </div>
      </div>
    </div>
  )
}

export function ResponseSending() {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden">
      <span aria-hidden className="hatch absolute inset-[-30%] text-crimson/20 anim-sweep" />
      <div className="relative z-10 flex items-center gap-3">
        <span className="h-[34px] w-[5px] skew-bar bg-crimson" />
        <span
          className="type-display text-[30px] leading-none text-bone"
          style={{ transform: 'skewX(-10deg)' }}
        >
          SENDING REQUEST
        </span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-[6px] w-[10px] skew-bar bg-crimson"
              style={{ animation: `tick-blink 620ms ${i * 150}ms infinite steps(1)` }}
            />
          ))}
        </span>
      </div>
    </div>
  )
}

export function ResponseFailure({ failure }: { failure: HttpFailure }) {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden px-8">
      <Halftone className="text-crimson/25" variant="dots-lg" fade="t" />
      <div className="relative z-10 flex max-w-[62ch] flex-col items-center gap-3 text-center">
        <div
          className="type-display text-[46px] leading-none text-crimson"
          style={{ transform: 'skewX(-10deg)' }}
        >
          NO RESPONSE
        </div>
        <div className="skew-bar bg-crimson px-3 py-1">
          <span className="unskew block type-label text-bone">{failure.kind}</span>
        </div>
        <p data-selectable className="type-mono text-[12px] leading-relaxed text-bone-2">
          {failure.message}
        </p>
        <span className="type-label text-bone-4">failed after {formatDuration(failure.durationMs)}</span>
      </div>
    </div>
  )
}
