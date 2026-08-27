import { useEffect, useRef, useState } from 'react'
import { GhostButton } from './GhostButton'
import { Modal } from './Modal'
import { TextField } from './TextField'

interface PromptModalProps {
  open: boolean
  title: string
  label?: string
  initialValue?: string
  confirmLabel?: string
  onConfirm(value: string): void
  onClose(): void
}

/** One-field dialog shared by every create/rename flow. */
export function PromptModal({
  open,
  title,
  label = 'Name',
  initialValue = '',
  confirmLabel = 'Confirm',
  onConfirm,
  onClose,
}: PromptModalProps) {
  const [value, setValue] = useState(initialValue)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setValue(initialValue)
    const id = setTimeout(() => input.current?.select(), 30)
    return () => clearTimeout(id)
  }, [open, initialValue])

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onConfirm(trimmed)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      width={420}
      footer={
        <>
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <GhostButton tone="crimson" onClick={submit} disabled={!value.trim()}>
            {confirmLabel}
          </GhostButton>
        </>
      }
    >
      <label className="type-label mb-1.5 block text-bone-4">{label}</label>
      <TextField
        ref={input}
        mono={false}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />
    </Modal>
  )
}
