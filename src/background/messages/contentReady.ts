import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getRSS } from "~/background/rss"

const handler: PlasmoMessaging.MessageHandler = (req, res) => {
  getRSS(req.sender.tab.id, req.sender.tab.url)
  res.send("")
}

export default handler
