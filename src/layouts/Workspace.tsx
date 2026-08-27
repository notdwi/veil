import { useCallback, useRef } from 'react'
import { Resizer } from '@/components/ui/Resizer'
import { RequestPanel } from '@/features/requests/RequestPanel'
import { ResponsePanel } from '@/features/response/ResponsePanel'
import { useUiStore } from '@/stores/useUiStore'

/** Request and response, split either horizontally or vertically. */
export function Workspace() {
  const layout = useUiStore((s) => s.layout)
  const ratio = useUiStore((s) => s.responseRatio)
  const setRatio = useUiStore((s) => s.setResponseRatio)
  const root = useRef<HTMLDivElement>(null)

  const side = layout === 'split'

  const onDrag = useCallback(
    (position: number) => {
      const box = root.current?.getBoundingClientRect()
      if (!box) return
      setRatio(
        side ? 1 - (position - box.left) / box.width : 1 - (position - box.top) / box.height,
      )
    },
    [setRatio, side],
  )

  return (
    <div
      ref={root}
      className={side ? 'flex min-h-0 min-w-0 flex-1' : 'flex min-h-0 min-w-0 flex-1 flex-col'}
    >
      <div className="flex min-h-0 min-w-0 flex-col" style={{ flex: `${1 - ratio} 1 0%` }}>
        <RequestPanel />
      </div>

      <Resizer axis={side ? 'x' : 'y'} onDrag={onDrag} />

      <div className="flex min-h-0 min-w-0 flex-col" style={{ flex: `${ratio} 1 0%` }}>
        <ResponsePanel edge={side ? 'left' : 'top'} />
      </div>
    </div>
  )
}
