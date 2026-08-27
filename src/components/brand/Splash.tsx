import { Halftone } from '@/components/deco/Halftone'
import { Shards } from '@/components/deco/Shards'
import { VeilMark } from './VeilMark'

/** Boot curtain. Visible only while the workspace hydrates. */
export function Splash() {
  return (
    <div className="relative grid h-full place-items-center overflow-hidden bg-ink">
      <Shards fade="none" className="opacity-30" />
      <Halftone className="text-crimson/25" variant="dots-lg" fade="t" />

      <div className="relative z-10 flex flex-col items-center gap-4 anim-slash">
        <div className="flex items-center gap-5">
          <VeilMark size={62} />
          <span
            className="type-display text-[64px] leading-none text-bone"
            style={{ letterSpacing: '0.12em', transform: 'skewX(-9deg)' }}
          >
            VEIL
          </span>
        </div>
        <p className="type-label text-[9px] tracking-[0.3em] text-bone-4">
          A stylish, lightweight API client
        </p>
      </div>

      <div className="absolute bottom-10 flex items-center gap-2">
        <span className="h-[4px] w-[26px] skew-bar bg-crimson anim-strike" />
        <span className="type-label text-bone-4">Loading workspace</span>
      </div>
    </div>
  )
}
