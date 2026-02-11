import { useEffect, useRef } from "react"

import { sendToBackground } from "~/lib/messaging"

type OffscreenMessage = {
  name: string
  body?: unknown
}

function OffscreenPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const onWindowMessage = (
      event: MessageEvent<Partial<OffscreenMessage>>,
    ) => {
      if (
        typeof event.data?.name === "string" &&
        event.data.name.startsWith("response")
      ) {
        chrome.runtime.sendMessage(event.data)
        sendToBackground({
          name: event.data.name,
          body: event.data.body,
        })
      }
    }

    const onRuntimeMessage = (msg: { data?: unknown }) => {
      iframeRef.current?.contentWindow?.postMessage(msg.data, "*")
    }

    window.addEventListener("message", onWindowMessage)
    chrome.runtime.onMessage.addListener(onRuntimeMessage)

    return () => {
      window.removeEventListener("message", onWindowMessage)
      chrome.runtime.onMessage.removeListener(onRuntimeMessage)
    }
  }, [])

  return <iframe id="sandbox" src="/sandbox.html" ref={iframeRef}></iframe>
}

export default OffscreenPage
