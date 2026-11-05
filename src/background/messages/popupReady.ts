import { getCachedRSS, getRSS } from "~/background/rss"

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
      async ([tab]) => {
        if (!tab?.id || !tab.url) {
          resolve(undefined)
          return
        }

        try {
          let cachedRSS = getCachedRSS(tab.id)
          if (!cachedRSS) {
            await getRSS(tab.id, tab.url)
            cachedRSS = getCachedRSS(tab.id)
          }
          resolve(cachedRSS)
        } catch (error) {
          console.error(error)
          resolve(undefined)
        }
      },
    )
  })
}

export default handler
