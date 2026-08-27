import type { Backend } from './port'
import { tauriBackend } from './tauri'
import { webBackend } from './web'

const isNative =
  typeof window !== 'undefined' &&
  ('__TAURI_INTERNALS__' in window || '__TAURI__' in window)

export const backend: Backend = isNative ? tauriBackend : webBackend

export const isNativeShell = isNative

export type { Backend }
