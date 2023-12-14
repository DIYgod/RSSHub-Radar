import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getCachedRSS } from "~/background/rss"
 
const handler: PlasmoMessaging.MessageHandler = (req, res) => {
  console.debug("popup ready", req)

  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, ([tab]) => {
    res.send(getCachedRSS(tab.id))
  });
}

export default handler