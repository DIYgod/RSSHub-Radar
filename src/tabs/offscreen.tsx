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

    const onRuntimeMessage = (msg: {
      target?: string
      data?: {
        name?: string
        body?: {
          name?: string
          payload?: Record<string, string | number | undefined>
        }
      }
    }) => {
      if (
        msg?.target === "offscreen" &&
        msg?.data?.name === "trackEvent" &&
        msg?.data?.body?.name &&
        typeof window.gtag === "function"
      ) {
        window.gtag("event", msg.data.body.name, msg.data.body.payload)
        return
      }

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
