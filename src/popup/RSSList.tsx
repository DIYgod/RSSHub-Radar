import RSSItem from './RSSItem'
import type { RSSData } from '~/lib/types'

function RSSList({
  title,
  list,
}: {
  title: string
  list: RSSData[]
}) {
  if (list.length === 0) {
    return null
  }
  return (
    <div className="space-y-4">
        <h2 className="text-base font-bold">{chrome.i18n.getMessage(title)}</h2>
      <ul>
        {list.map((item) => (
          <RSSItem key={item.url} item={item} />
        ))}
      </ul>
    </div>
  )
}

export default RSSList