import { RequestBar } from './RequestBar'
import { RequestHeadline } from './RequestHeadline'
import { RequestTabs } from './RequestTabs'

export function RequestPanel() {
  return (
    <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-ink">
      <RequestHeadline />
      <RequestBar />
      <div className="h-3 shrink-0" />
      <RequestTabs />
    </section>
  )
}
