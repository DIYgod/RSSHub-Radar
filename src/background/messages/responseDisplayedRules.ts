import type { PlasmoMessaging } from "@plasmohq/messaging"

import { setDisplayedRules } from "~/background/rules"

const handler: PlasmoMessaging.MessageHandler = (req, res) => {
  setDisplayedRules(req.body.displayedRules)
  res.send("")
}

export default handler
