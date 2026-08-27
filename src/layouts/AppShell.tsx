import { useCallback } from 'react'
import { Resizer } from '@/components/ui/Resizer'
import { useUiStore } from '@/stores/useUiStore'
import { Sidebar } from './Sidebar'
import { TitleBar } from './TitleBar'
import { Workspace } from './Workspace'

export function AppShell() {
  const sidebarWidth = useUiStore((s) => s.sidebarWidth)
  const setSidebarWidth = useUiStore((s) => s.setSidebarWidth)

  const onDrag = useCallback((x: number) => setSidebarWidth(x), [setSidebarWidth])

  return (
    <div className="grain flex h-full flex-col overflow-hidden bg-ink">
      <TitleBar />

      <div className="relative flex min-h-0 flex-1">
        <div className="shrink-0" style={{ width: sidebarWidth }}>
          <Sidebar />
        </div>

        <Resizer axis="x" onDrag={onDrag} />

        {/* Crimson wedge stitching the sidebar to the workspace. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 z-10 w-[2px] bg-crimson/70"
          style={{ left: sidebarWidth + 2, clipPath: 'polygon(0 0, 100% 0, 100% 22%, 0 30%)' }}
        />

        <Workspace />
      </div>
    </div>
  )
}
