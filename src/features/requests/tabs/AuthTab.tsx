import { useState } from 'react'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/cn'
import { IconButton } from '@/components/ui/IconButton'
import { SkewTabs } from '@/components/ui/SkewTabs'
import { TextField } from '@/components/ui/TextField'
import { useRequestStore } from '@/stores/useRequestStore'
import type { AuthMode } from '@/types'

const MODES = [
  { id: 'none' as const, label: 'None' },
  { id: 'basic' as const, label: 'Basic' },
  { id: 'bearer' as const, label: 'Bearer' },
]

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid grid-cols-[110px_1fr] items-center gap-3 border-b border-hairline/60 py-1.5">
      <span className="type-label text-bone-4">{label}</span>
      <div className="flex items-center gap-1">{children}</div>
    </label>
  )
}

export function AuthTab() {
  const auth = useRequestStore((s) => s.draft.auth)
  const patchAuth = useRequestStore((s) => s.patchAuth)
  const [reveal, setReveal] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <SkewTabs
        size="sm"
        items={MODES}
        value={auth.mode}
        onChange={(mode: AuthMode) => patchAuth({ mode })}
      />

      {auth.mode === 'none' && (
        <p className="type-label max-w-[46ch] leading-[1.7] text-bone-4">
          No authorization header is attached to this request.
        </p>
      )}

      {auth.mode === 'basic' && (
        <div className="max-w-[560px]">
          <Row label="Username">
            <TextField
              bare
              value={auth.username}
              placeholder="user"
              onChange={(e) => patchAuth({ username: e.target.value })}
            />
          </Row>
          <Row label="Password">
            <TextField
              bare
              type={reveal ? 'text' : 'password'}
              value={auth.password}
              placeholder="••••••••"
              onChange={(e) => patchAuth({ password: e.target.value })}
            />
            <IconButton label={reveal ? 'Hide' : 'Reveal'} onClick={() => setReveal((r) => !r)}>
              {reveal ? <EyeOff size={12} strokeWidth={2.2} /> : <Eye size={12} strokeWidth={2.2} />}
            </IconButton>
          </Row>
        </div>
      )}

      {auth.mode === 'bearer' && (
        <div className="max-w-[560px]">
          <Row label="Token">
            <TextField
              bare
              type={reveal ? 'text' : 'password'}
              value={auth.token}
              placeholder="{{token}}"
              onChange={(e) => patchAuth({ token: e.target.value })}
              className={cn(auth.token.includes('{{') && 'text-magenta')}
            />
            <IconButton label={reveal ? 'Hide' : 'Reveal'} onClick={() => setReveal((r) => !r)}>
              {reveal ? <EyeOff size={12} strokeWidth={2.2} /> : <Eye size={12} strokeWidth={2.2} />}
            </IconButton>
          </Row>
        </div>
      )}

      {auth.mode !== 'none' && (
        <p className="flex items-start gap-1.5 type-label max-w-[52ch] leading-[1.7] text-bone-4">
          <ShieldCheck size={12} strokeWidth={2.2} className="mt-[-1px] shrink-0 text-jade" />
          Reference a secret environment variable instead of pasting a literal — secrets are kept in
          the OS credential store, not in the workspace database.
        </p>
      )}
    </div>
  )
}
