import { BleedTitle } from '@/components/deco/BleedTitle'
import { useRequestStore } from '@/stores/useRequestStore'
import { useUiStore } from '@/stores/useUiStore'
import { ResponseBody } from './ResponseBody'
import { ResponseHeaders } from './ResponseHeaders'
import { ResponseHeadline } from './ResponseHeadline'
import { ResponseFailure, ResponseIdle, ResponseSending } from './ResponseStates'

interface ResponsePanelProps {
  /** Which side abuts the request panel — the crimson blade marks that seam. */
  edge?: 'top' | 'left'
}

export function ResponsePanel({ edge = 'top' }: ResponsePanelProps) {
  const phase = useRequestStore((s) => s.phase)
  const response = useRequestStore((s) => s.response)
  const failure = useRequestStore((s) => s.failure)
  const tab = useUiStore((s) => s.responseTab)

  return (
    <section className="@container relative flex min-h-0 flex-1 flex-col overflow-hidden bg-ink-2">
      {!response && <BleedTitle corner="bc">RESPONSE</BleedTitle>}

      {/* Crimson blade marking the seam with the request panel. */}
      <span
        aria-hidden
        className={
          edge === 'left'
            ? 'absolute left-0 top-0 z-20 h-[240px] w-[3px] bg-crimson'
            : 'clip-blade absolute left-0 top-0 z-20 h-[3px] w-[220px] bg-crimson'
        }
        style={
          edge === 'left'
            ? { clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 18px), 0 100%)' }
            : undefined
        }
      />

      <ResponseHeadline response={response} />

      <div className="relative z-10 min-h-0 flex-1">
        {phase === 'sending' && <ResponseSending />}
        {phase === 'failed' && failure && <ResponseFailure failure={failure} />}
        {phase === 'idle' && !response && <ResponseIdle />}
        {response && phase !== 'sending' && (
          <div className="h-full anim-wipe">
            {tab === 'headers' ? (
              <div className="h-full overflow-y-auto">
                <ResponseHeaders headers={response.headers} />
              </div>
            ) : (
              <ResponseBody response={response} mode={tab === 'raw' ? 'raw' : 'pretty'} />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
