import { Splash } from '@/components/brand/Splash'
import { Toasts } from '@/components/ui/Toasts'
import { CommandPalette } from '@/features/command-palette/CommandPalette'
import { EnvEditor } from '@/features/environments/EnvEditor'
import { SettingsModal } from '@/features/settings/SettingsModal'
import { AppShell } from '@/layouts/AppShell'
import { useAppShortcuts } from '@/app/useAppShortcuts'
import { useHydrate } from '@/app/useHydrate'

export default function App() {
  const ready = useHydrate()
  useAppShortcuts()

  if (!ready) return <Splash />

  return (
    <>
      <AppShell />
      <CommandPalette />
      <EnvEditor />
      <SettingsModal />
      <Toasts />
    </>
  )
}
