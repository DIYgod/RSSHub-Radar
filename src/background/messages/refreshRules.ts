import type { PlasmoMessaging } from "@plasmohq/messaging"
import { refreshRules } from "~/background/rules"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  res.send(await refreshRules())
}

export default handler