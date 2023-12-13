import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getRules } from "~/background"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.debug("request rules", req)

  res.send(await getRules())
}

export default handler