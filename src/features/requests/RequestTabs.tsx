import { SkewTabs, type TabItem } from '@/components/ui/SkewTabs'
import { useRequestStore } from '@/stores/useRequestStore'
import { useUiStore, type RequestTab } from '@/stores/useUiStore'
import { AuthTab } from './tabs/AuthTab'
import { BodyTab } from './tabs/BodyTab'
import { HeadersTab } from './tabs/HeadersTab'
import { ParamsTab } from './tabs/ParamsTab'

export function RequestTabs() {
  const tab = useUiStore((s) => s.requestTab)
  const setTab = useUiStore((s) => s.setRequestTab)
  const draft = useRequestStore((s) => s.draft)

  const items: TabItem<RequestTab>[] = [
    { id: 'params', label: 'Params', badge: draft.params.filter((p) => p.enabled && p.key).length },
    { id: 'headers', label: 'Headers', badge: draft.headers.filter((h) => h.enabled && h.key).length },
    { id: 'body', label: 'Body', badge: draft.bodyMode === 'none' ? undefined : draft.bodyMode.toUpperCase() },
    { id: 'auth', label: 'Auth', badge: draft.auth.mode === 'none' ? undefined : '•' },
  ]

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-hairline px-5 pt-2">
        <SkewTabs items={items} value={tab} onChange={setTab} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
        {tab === 'params' && <ParamsTab />}
        {tab === 'headers' && <HeadersTab />}
        {tab === 'body' && <BodyTab />}
        {tab === 'auth' && <AuthTab />}
      </div>
    </div>
  )
}
