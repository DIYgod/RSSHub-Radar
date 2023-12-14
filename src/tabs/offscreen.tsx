import { useRef } from "react";
import { sendToBackground } from "@plasmohq/messaging"

console.log("HELLO WORLD FROM OFFSCREEN")

window.addEventListener('message', (event) => {
  if (event.data?.name.startsWith("response")) {
    chrome.runtime.sendMessage(event.data)
    sendToBackground(event.data)
  }
});

function OffscreenPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  chrome.runtime.onMessage.addListener(async (msg) => {
    console.debug("Received message from background", msg);
    iframeRef.current?.contentWindow?.postMessage(msg.data, "*");
  })

  return (
    <iframe id="sandbox" src="/sandboxes/index.html" ref={iframeRef}></iframe>
  );
}

export default OffscreenPage;