import { getRSS } from "~/background/rss"

const handler = (_message: unknown, sender: chrome.runtime.MessageSender) => {
  if (sender.tab?.id && sender.tab?.url) {
    getRSS(sender.tab.id, sender.tab.url)
  }
  return ""
}

export default handler
