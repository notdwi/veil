import { GhostButton } from '@/components/ui/GhostButton'
import { Modal } from '@/components/ui/Modal'
import { isNativeShell } from '@/lib/backend'
import { useUiStore } from '@/stores/useUiStore'
import { LanguagePicker } from './LanguagePicker'
import { LayoutPicker } from './LayoutPicker'
import { SettingsSection } from './SettingsSection'

const VERSION = '0.1.0'

export function SettingsModal() {
  const open = useUiStore((s) => s.settingsOpen)
  const setOpen = useUiStore((s) => s.setSettingsOpen)
  const layout = useUiStore((s) => s.layout)
  const setLayout = useUiStore((s) => s.setLayout)
  const language = useUiStore((s) => s.language)
  const setLanguage = useUiStore((s) => s.setLanguage)

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="Settings"
      width={560}
      footer={
        <GhostButton tone="crimson" onClick={() => setOpen(false)}>
          Done
        </GhostButton>
      }
    >
      <SettingsSection label="Layout">
        <LayoutPicker value={layout} onChange={setLayout} />
      </SettingsSection>

      <SettingsSection label="Language" note="Selection is stored — translations land in a later release">
        <LanguagePicker value={language} onChange={setLanguage} />
      </SettingsSection>

      <SettingsSection label="About">
        <dl className="grid grid-cols-[110px_1fr] gap-y-1.5 text-[11.5px]">
          <dt className="type-label text-bone-4">Version</dt>
          <dd className="type-mono text-bone-2">{VERSION}</dd>
          <dt className="type-label text-bone-4">Runtime</dt>
          <dd className="type-mono text-bone-2">{isNativeShell ? 'Tauri shell' : 'Browser preview'}</dd>
          <dt className="type-label text-bone-4">Secrets</dt>
          <dd className="type-mono text-bone-2">
            {isNativeShell ? 'OS credential store' : 'Local storage (preview only)'}
          </dd>
        </dl>
      </SettingsSection>
    </Modal>
  )
}
