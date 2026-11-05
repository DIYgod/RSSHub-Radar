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
        void sendToBackground({
          name: event.data.name,
          body: event.data.body,
        }).catch((error) => {
          console.error("Failed to forward sandbox response", error)
        })
      }
    }

    const onRuntimeMessage = (msg: { target?: string; data?: unknown }) => {
      if (msg.target === "offscreen") {
        iframeRef.current?.contentWindow?.postMessage(msg.data, "*")
      }
    }

    window.addEventListener("message", onWindowMessage)
    chrome.runtime.onMessage.addListener(onRuntimeMessage)

    return () => {
      window.removeEventListener("message", onWindowMessage)
      chrome.runtime.onMessage.removeListener(onRuntimeMessage)
    }
  }, [])

  return (
    <iframe
      id="sandbox"
      src="/sandbox.html"
      ref={iframeRef}
      onLoad={() => {
        void sendToBackground({ name: "offscreenReady" }).catch((error) => {
          console.error(
            "Failed to notify background that offscreen is ready",
            error,
          )
        })
      }}
    ></iframe>
  )
}

export default OffscreenPage
