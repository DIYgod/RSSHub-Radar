import { useMessage } from "@plasmohq/messaging/hook"
import { sendToBackground } from "@plasmohq/messaging"
import { useEffect } from "react"

const Messages = () => {
  useMessage<string, string>(async (req, res) => {
    if (req.name === "requestHTML") {
      res.send(document.documentElement.outerHTML)
    }
  })

  useEffect(() => {
    sendToBackground({
      name: "contentReady",
    })
  })

  return <></>
}

export default Messages
