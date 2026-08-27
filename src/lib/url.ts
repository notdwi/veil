const HAS_SCHEME = /^[a-zA-Z][\w+.-]*:\/\//

/** Hosts that are almost never served over TLS during development. */
function isLocalHost(host: string): boolean {
  const bare = host.replace(/^\[|\]$/g, '').toLowerCase()
  return (
    bare === 'localhost' ||
    bare.endsWith('.localhost') ||
    bare === '0.0.0.0' ||
    bare === '::1' ||
    /^127(\.\d{1,3}){3}$/.test(bare)
  )
}

/** Extracts the host of a scheme-less authority, ignoring userinfo and port. */
function hostOf(input: string): string {
  const authority = input.split(/[/?#]/, 1)[0]
  const afterUserInfo = authority.slice(authority.lastIndexOf('@') + 1)
  if (afterUserInfo.startsWith('[')) return afterUserInfo.slice(0, afterUserInfo.indexOf(']') + 1)
  return afterUserInfo.split(':', 1)[0]
}

/** The scheme VEIL will prepend when the user omits one. */
export function inferScheme(url: string): 'https' | 'http' {
  return isLocalHost(hostOf(url.trim())) ? 'http' : 'https'
}

export function hasScheme(url: string): boolean {
  return HAS_SCHEME.test(url.trim())
}

/** `api.example.com/users` -> `https://…`, `localhost:3000` -> `http://…`. */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed || hasScheme(trimmed)) return trimmed
  return `${inferScheme(trimmed)}://${trimmed}`
}
