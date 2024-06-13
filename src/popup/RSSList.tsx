import type { RSSData } from "~/lib/types"

import RSSItem from "./RSSItem"

function RSSList({ type, list }: { type: string; list: RSSData[] }) {
  if (list.length === 0) {
    return null
  }
  return (
    <div className="space-y-4">
      <h2 className="text-base font-bold">{chrome.i18n.getMessage(type)}</h2>
      <ul className="overflow-x-auto w-max min-w-full max-w-[700px]">
        {list.map((item) => (
          <RSSItem key={item.url + item.title} item={item} type={type} />
        ))}
      </ul>
    </div>
  )
}

export default RSSList
