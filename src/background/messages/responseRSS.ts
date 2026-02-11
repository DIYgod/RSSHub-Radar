import { setRSS } from "~/background/rss"

const handler = async (
  message: { body?: { tabId?: number; rss?: any } },
  sender?: chrome.runtime.MessageSender,
) => {
  const tabId = message?.body?.tabId ?? sender?.tab?.id
  if (tabId) {
    setRSS(tabId, message?.body?.rss)
  }
  return ""
}

export default handler
