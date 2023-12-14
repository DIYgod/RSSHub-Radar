import type { PlasmoMessaging } from "@plasmohq/messaging"
import { setDisplayedRules } from "~/background/rules"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.debug("response displayed rules", req)
  
  setDisplayedRules(req.body.displayedRules)
}

export default handler