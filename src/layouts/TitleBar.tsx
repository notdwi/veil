import { ChevronsRight, Settings } from 'lucide-react'
import { Wordmark } from '@/components/brand/Wordmark'
import { Halftone } from '@/components/deco/Halftone'
import { KeyHint } from '@/components/ui/KeyHint'
import { EnvSwitcher } from '@/features/environments/EnvSwitcher'
import { IconButton } from '@/components/ui/IconButton'
import { useUiStore } from '@/stores/useUiStore'
import { WindowControls } from './WindowControls'

/** Draggable app chrome. The crimson wedge on the left anchors the brand. */
export function TitleBar() {
  const openPalette = useUiStore((s) => s.setPaletteOpen)
  const openSettings = useUiStore((s) => s.setSettingsOpen)

  return (
    <header
      data-tauri-drag-region
      className="relative z-30 flex h-[42px] shrink-0 items-stretch border-b border-hairline bg-ink"
    >
      <div aria-hidden className="clip-blade relative w-[186px] shrink-0 bg-crimson-ghost">
        <Halftone className="text-crimson/40" fade="r" />
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Wordmark />
      </div>

      <div data-tauri-drag-region className="flex flex-1 items-center justify-end gap-2 pr-2">
        <button
          type="button"
          onClick={() => openPalette(true)}
          className="group flex items-center gap-2 px-2 py-1 text-bone-4 transition-colors duration-(--t-tick) hover:text-bone"
        >
          <ChevronsRight size={13} strokeWidth={2.6} className="text-crimson" />
          <span className="type-label hidden sm:inline">Commands</span>
          <KeyHint keys="Ctrl P" />
        </button>

        <span aria-hidden className="h-[18px] w-px bg-hairline" />

        <EnvSwitcher />

        <IconButton label="Settings" onClick={() => openSettings(true)}>
          <Settings size={13} strokeWidth={2.2} />
        </IconButton>
      </div>

      <WindowControls />
    </header>
  )
}
