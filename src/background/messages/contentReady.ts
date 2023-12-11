import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getRSS } from "~/background"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.debug("content ready", req)

  getRSS(req.sender.tab.id, req.sender.tab.url)
}

export default handler