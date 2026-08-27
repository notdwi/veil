import { create } from 'zustand'
import { backend } from '@/lib/backend'
import { uid } from '@/lib/id'
import { emptyEnvironment } from './defaults'
import { loadSecrets, persistSecrets, stripSecrets } from '@/lib/secrets'
import type { Environment, EnvVariable } from '@/types'

const ACTIVE_KEY = 'veil:active-env'

interface EnvState {
  environments: Environment[]
  activeId: string | null
  hydrated: boolean

  hydrate(): Promise<void>
  setActive(id: string | null): void
  create(name: string): Promise<Environment>
  rename(id: string, name: string): Promise<void>
  remove(id: string): Promise<void>
  setVariables(id: string, variables: EnvVariable[]): Promise<void>
  addVariable(id: string): Promise<void>
}

async function persist(env: Environment) {
  await persistSecrets(env)
  await backend.saveEnvironment(stripSecrets(env))
}

export const useEnvStore = create<EnvState>((set, get) => ({
  environments: [],
  activeId: null,
  hydrated: false,

  async hydrate() {
    const rows = await backend.listEnvironments()
    const environments = await Promise.all(rows.map(loadSecrets))
    const stored = localStorage.getItem(ACTIVE_KEY)
    const activeId = environments.some((e) => e.id === stored) ? stored : (environments[0]?.id ?? null)
    set({ environments, activeId, hydrated: true })
  },

  setActive(id) {
    if (id) localStorage.setItem(ACTIVE_KEY, id)
    else localStorage.removeItem(ACTIVE_KEY)
    set({ activeId: id })
  },

  async create(name) {
    const env = emptyEnvironment(name)
    await persist(env)
    set((s) => ({ environments: [...s.environments, env] }))
    get().setActive(env.id)
    return env
  },

  async rename(id, name) {
    const env = get().environments.find((e) => e.id === id)
    if (!env) return
    const next = { ...env, name }
    await persist(next)
    set((s) => ({ environments: s.environments.map((e) => (e.id === id ? next : e)) }))
  },

  async remove(id) {
    const env = get().environments.find((e) => e.id === id)
    if (env) await persistSecrets({ ...env, variables: env.variables.map((v) => ({ ...v, secret: false })) })
    await backend.deleteEnvironment(id)
    set((s) => {
      const environments = s.environments.filter((e) => e.id !== id)
      return { environments, activeId: s.activeId === id ? (environments[0]?.id ?? null) : s.activeId }
    })
  },

  async setVariables(id, variables) {
    const env = get().environments.find((e) => e.id === id)
    if (!env) return
    const next = { ...env, variables }
    set((s) => ({ environments: s.environments.map((e) => (e.id === id ? next : e)) }))
    await persist(next)
  },

  async addVariable(id) {
    const env = get().environments.find((e) => e.id === id)
    if (!env) return
    const variable: EnvVariable = { id: uid('var'), key: '', value: '', secret: false, enabled: true }
    await get().setVariables(id, [...env.variables, variable])
  },
}))

export function activeEnvironment(state: EnvState): Environment | null {
  return state.environments.find((e) => e.id === state.activeId) ?? null
}
