import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getDisplayedRules } from "~/background/rules"

const handler: PlasmoMessaging.MessageHandler = (req, res) => {
  getDisplayedRules().then((rules) => {
    res.send(rules)
  })
  return true
}

export default handler
