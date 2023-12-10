import { useRef } from "react";
import { sendToBackground } from "@plasmohq/messaging"

console.log("HELLO WORLD FROM OFFSCREEN")

window.addEventListener('message', (event) => {
  if (event.data?.name === "responseRSS") {
    chrome.runtime.sendMessage(event.data)
    sendToBackground({
      name: "responseRSS",
      body: {
        data: 1
      }
    })
  }
});

function OffscreenPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  chrome.runtime.onMessage.addListener((msg) => {
    iframeRef.current?.contentWindow?.postMessage(msg.data, "*");
  })

  return (
    <iframe id="sandbox" src="/sandboxes/index.html" ref={iframeRef}></iframe>
  );
}

export default OffscreenPage;