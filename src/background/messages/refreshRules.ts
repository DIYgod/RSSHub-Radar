import type { PlasmoMessaging } from "@plasmohq/messaging"

import { refreshRules } from "~/background/rules"

const handler: PlasmoMessaging.MessageHandler = (req, res) => {
  refreshRules().then(() => {
    res.send(true)
  })
  return true
}

export default handler
