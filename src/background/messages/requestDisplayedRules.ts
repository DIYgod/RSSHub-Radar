import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getDisplayedRules } from "~/background/rules"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.debug("request displayed rules", req)

  res.send(await getDisplayedRules())
}

export default handler