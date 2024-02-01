import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getCachedRSS } from "~/background/rss"

const handler: PlasmoMessaging.MessageHandler = (req, res) => {
  chrome.tabs.query(
    {
      active: true,
      lastFocusedWindow: true,
    },
    ([tab]) => {
      res.send(getCachedRSS(tab.id))
    },
  )
  return true
}

export default handler
