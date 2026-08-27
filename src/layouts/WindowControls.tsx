import { useEffect, useState } from 'react'
import { Minus, Square, X, Copy } from 'lucide-react'
import { cn } from '@/lib/cn'
import { isNativeShell } from '@/lib/backend'

type Win = { minimize(): Promise<void>; toggleMaximize(): Promise<void>; close(): Promise<void>; isMaximized(): Promise<boolean> }

/** Custom chrome. Loaded lazily so the browser dev build never touches Tauri. */
export function WindowControls() {
  const [win, setWin] = useState<Win | null>(null)
  const [maximized, setMaximized] = useState(false)

  useEffect(() => {
    if (!isNativeShell) return
    let cancelled = false
    void import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
      if (cancelled) return
      const w = getCurrentWindow() as unknown as Win
      setWin(w)
      void w.isMaximized().then(setMaximized)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!win) return null

  const Btn = ({
    onClick,
    label,
    danger,
    children,
  }: {
    onClick(): void
    label: string
    danger?: boolean
    children: React.ReactNode
  }) => (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'grid h-full w-[42px] place-items-center text-bone-3 transition-colors duration-(--t-tick)',
        danger ? 'hover:bg-crimson hover:text-bone' : 'hover:bg-ink-4 hover:text-bone',
      )}
    >
      {children}
    </button>
  )

  return (
    <div className="flex h-full items-stretch">
      <Btn label="Minimize" onClick={() => void win.minimize()}>
        <Minus size={13} strokeWidth={2.2} />
      </Btn>
      <Btn
        label={maximized ? 'Restore' : 'Maximize'}
        onClick={() => void win.toggleMaximize().then(() => setMaximized((m) => !m))}
      >
        {maximized ? <Copy size={11} strokeWidth={2.2} /> : <Square size={10} strokeWidth={2.4} />}
      </Btn>
      <Btn label="Close" danger onClick={() => void win.close()}>
        <X size={14} strokeWidth={2.2} />
      </Btn>
    </div>
  )
}
