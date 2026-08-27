import { Eye, EyeOff, KeyRound, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Checkbox } from '@/components/ui/Checkbox'
import { IconButton } from '@/components/ui/IconButton'
import { TextField } from '@/components/ui/TextField'
import type { EnvVariable } from '@/types'

interface EnvVariableRowProps {
  variable: EnvVariable
  onChange(patch: Partial<EnvVariable>): void
  onRemove(): void
}

export function EnvVariableRow({ variable, onChange, onRemove }: EnvVariableRowProps) {
  const [reveal, setReveal] = useState(false)
  const hidden = variable.secret && !reveal

  return (
    <div className="group grid grid-cols-[26px_minmax(120px,1fr)_minmax(160px,1.6fr)_32px_26px] items-center gap-x-1 border-b border-hairline/50 transition-colors duration-(--t-tick) hover:bg-ink-3/60">
      <Checkbox
        checked={variable.enabled}
        onChange={(enabled) => onChange({ enabled })}
        label="Enable variable"
      />
      <TextField
        bare
        value={variable.key}
        placeholder="base_url"
        onChange={(e) => onChange({ key: e.target.value.replace(/\s/g, '_') })}
        className={cn(!variable.enabled && 'text-bone-4 line-through')}
      />
      <TextField
        bare
        type={hidden ? 'password' : 'text'}
        value={variable.value}
        placeholder={variable.secret ? '••••••••' : 'https://api.example.com'}
        onChange={(e) => onChange({ value: e.target.value })}
        className={cn(!variable.enabled && 'text-bone-4')}
      />
      <div className="flex items-center justify-center gap-0.5">
        <IconButton
          label={variable.secret ? 'Stored in OS keystore' : 'Mark as secret'}
          active={variable.secret}
          onClick={() => onChange({ secret: !variable.secret })}
        >
          <KeyRound size={11} strokeWidth={2.2} />
        </IconButton>
        {variable.secret && (
          <IconButton label={reveal ? 'Hide value' : 'Reveal value'} onClick={() => setReveal((r) => !r)}>
            {reveal ? <EyeOff size={11} strokeWidth={2.2} /> : <Eye size={11} strokeWidth={2.2} />}
          </IconButton>
        )}
      </div>
      <IconButton
        label="Remove variable"
        tone="danger"
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={11} strokeWidth={2.2} />
      </IconButton>
    </div>
  )
}
