import type {
  Collection,
  Environment,
  HistoryEntry,
  HttpResponsePayload,
  RequestDraft,
  SendRequestInput,
} from '@/types'

/** The single seam between the UI and whatever executes/persists for it. */
export interface Backend {
  readonly kind: 'native' | 'web'

  send(input: SendRequestInput): Promise<HttpResponsePayload>

  listCollections(): Promise<Collection[]>
  saveCollection(collection: Collection): Promise<void>
  deleteCollection(id: string): Promise<void>

  listRequests(): Promise<RequestDraft[]>
  saveRequest(request: RequestDraft): Promise<void>
  deleteRequest(id: string): Promise<void>

  listHistory(limit: number): Promise<HistoryEntry[]>
  pushHistory(entry: HistoryEntry): Promise<void>
  clearHistory(): Promise<void>

  listEnvironments(): Promise<Environment[]>
  saveEnvironment(environment: Environment): Promise<void>
  deleteEnvironment(id: string): Promise<void>

  readSecret(ref: string): Promise<string | null>
  writeSecret(ref: string, value: string): Promise<void>
  removeSecret(ref: string): Promise<void>
}
