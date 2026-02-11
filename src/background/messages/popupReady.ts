import { getCachedRSS } from "~/background/rss"

const handler = (
  _message?: unknown,
  _sender?: chrome.runtime.MessageSender,
) => {
  return new Promise((resolve) => {
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      ([tab]) => {
        resolve(getCachedRSS(tab.id))
      },
    )
  })
}

export default handler
