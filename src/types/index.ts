export const HTTP_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
] as const

export type HttpMethod = (typeof HTTP_METHODS)[number]

export type BodyMode = 'none' | 'json' | 'text'
export type AuthMode = 'none' | 'basic' | 'bearer'

export interface KeyValue {
  id: string
  key: string
  value: string
  enabled: boolean
}

export interface AuthConfig {
  mode: AuthMode
  username: string
  password: string
  token: string
}

export interface RequestDraft {
  id: string
  collectionId: string | null
  name: string
  method: HttpMethod
  url: string
  params: KeyValue[]
  headers: KeyValue[]
  bodyMode: BodyMode
  body: string
  auth: AuthConfig
  updatedAt: number
}

export interface Collection {
  id: string
  name: string
  createdAt: number
}

export interface SendRequestInput {
  method: HttpMethod
  url: string
  headers: [string, string][]
  body: string | null
  timeoutMs: number
}

export interface HttpResponsePayload {
  status: number
  statusText: string
  headers: [string, string][]
  body: string
  durationMs: number
  sizeBytes: number
  finalUrl: string
}

export interface HttpFailure {
  kind: 'network' | 'timeout' | 'invalid_url' | 'tls' | 'unknown'
  message: string
  durationMs: number
}

export interface HistoryEntry {
  id: string
  method: HttpMethod
  url: string
  status: number | null
  durationMs: number | null
  createdAt: number
  snapshot: RequestDraft
}

export interface EnvVariable {
  id: string
  key: string
  value: string
  secret: boolean
  enabled: boolean
}

export interface Environment {
  id: string
  name: string
  variables: EnvVariable[]
  createdAt: number
}
