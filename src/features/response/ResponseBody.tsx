import { useMemo } from 'react'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { EmptyState } from '@/components/ui/EmptyState'
import { findHeader } from '@/lib/http-meta'
import { isJsonLike, tryPrettyJson } from '@/lib/format'
import type { HttpResponsePayload } from '@/types'

interface ResponseBodyProps {
  response: HttpResponsePayload
  mode: 'pretty' | 'raw'
}

export function ResponseBody({ response, mode }: ResponseBodyProps) {
  const contentType = findHeader(response.headers, 'content-type')
  const json = isJsonLike(response.body, contentType)

  const value = useMemo(
    () => (mode === 'pretty' && json ? tryPrettyJson(response.body) : response.body),
    [mode, json, response.body],
  )

  if (!response.body) {
    return <EmptyState title="Empty body" hint={`${response.status} returned no payload.`} />
  }

  return (
    <CodeEditor
      value={value}
      readOnly
      language={json && mode === 'pretty' ? 'json' : 'text'}
      className="border-t border-hairline"
    />
  )
}
