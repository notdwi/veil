import { backend } from '@/lib/backend'
import type { Environment, EnvVariable } from '@/types'

export function secretRef(environmentId: string, variableId: string): string {
  return `env/${environmentId}/${variableId}`
}

/** Secret values never reach the workspace database — only the OS keystore. */
export function stripSecrets(environment: Environment): Environment {
  return {
    ...environment,
    variables: environment.variables.map((v) => (v.secret ? { ...v, value: '' } : v)),
  }
}

export async function persistSecrets(environment: Environment): Promise<void> {
  await Promise.all(
    environment.variables.map((v) => {
      const ref = secretRef(environment.id, v.id)
      return v.secret && v.value ? backend.writeSecret(ref, v.value) : backend.removeSecret(ref)
    }),
  )
}

export async function loadSecrets(environment: Environment): Promise<Environment> {
  const variables = await Promise.all(
    environment.variables.map(async (v): Promise<EnvVariable> => {
      if (!v.secret) return v
      const value = await backend.readSecret(secretRef(environment.id, v.id))
      return { ...v, value: value ?? '' }
    }),
  )
  return { ...environment, variables }
}
