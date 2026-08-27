import { invoke } from '@tauri-apps/api/core'
import type {
  Collection,
  Environment,
  HistoryEntry,
  HttpResponsePayload,
  RequestDraft,
  SendRequestInput,
} from '@/types'
import type { Backend } from './port'

export const tauriBackend: Backend = {
  kind: 'native',

  send: (input: SendRequestInput) => invoke<HttpResponsePayload>('send_request', { input }),

  listCollections: () => invoke<Collection[]>('list_collections'),
  saveCollection: (collection) => invoke<void>('save_collection', { collection }),
  deleteCollection: (id) => invoke<void>('delete_collection', { id }),

  listRequests: () => invoke<RequestDraft[]>('list_requests'),
  saveRequest: (request) => invoke<void>('save_request', { request }),
  deleteRequest: (id) => invoke<void>('delete_request', { id }),

  listHistory: (limit) => invoke<HistoryEntry[]>('list_history', { limit }),
  pushHistory: (entry) => invoke<void>('push_history', { entry }),
  clearHistory: () => invoke<void>('clear_history'),

  listEnvironments: () => invoke<Environment[]>('list_environments'),
  saveEnvironment: (environment) => invoke<void>('save_environment', { environment }),
  deleteEnvironment: (id) => invoke<void>('delete_environment', { id }),

  readSecret: (reference) => invoke<string | null>('read_secret', { reference }),
  writeSecret: (reference, value) => invoke<void>('write_secret', { reference, value }),
  removeSecret: (reference) => invoke<void>('remove_secret', { reference }),
}
