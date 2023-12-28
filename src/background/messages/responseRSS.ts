import type { PlasmoMessaging } from "@plasmohq/messaging"
import { setRSS } from "~/background/rss"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  setRSS(req.body.tabId, req.body.rss)
}

export default handler