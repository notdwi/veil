import type { SendRequestInput } from '@/types'

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\''`)}'`
}

export function toCurl(input: SendRequestInput): string {
  const parts = [`curl -X ${input.method}`, `  ${shellQuote(input.url)}`]
  for (const [k, v] of input.headers) {
    parts.push(`  -H ${shellQuote(`${k}: ${v}`)}`)
  }
  if (input.body) {
    parts.push(`  --data-raw ${shellQuote(input.body)}`)
  }
  return parts.join(' \\n')
}
