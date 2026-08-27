import type { ReactNode } from 'react'
import { Tag } from '@/components/ui/Tag'

interface SettingsSectionProps {
  label: string
  note?: string
  children: ReactNode
}

export function SettingsSection({ label, note, children }: SettingsSectionProps) {
  return (
    <section className="border-b border-hairline py-4 last:border-b-0">
      <header className="mb-3 flex items-center gap-2.5">
        <Tag size="sm">{label}</Tag>
        {note && <span className="type-label text-[8.5px] text-bone-4">{note}</span>}
      </header>
      {children}
    </section>
  )
}
