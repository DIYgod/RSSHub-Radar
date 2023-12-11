import { sendToBackground } from "@plasmohq/messaging"
import { useEffect } from "react"

const ContentReady = () => {
  useEffect(() => {
    sendToBackground({
      name: "contentReady",
    })
  })

  return <></>
}

export default ContentReady