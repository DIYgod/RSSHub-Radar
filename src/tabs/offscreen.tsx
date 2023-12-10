import { useRef } from "react";
import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

console.log("HELLO WORLD FROM OFFSCREEN")

const storage = new Storage({
    area: "local"
})

window.addEventListener('message', (event) => {
  if (event.data?.name === "responseRSS") {
    chrome.runtime.sendMessage(event.data)
    sendToBackground(event.data)
  }
});

function OffscreenPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  chrome.runtime.onMessage.addListener(async (msg) => {
    console.debug("Received message from background", msg);
    const rules = await storage.get("rules");
    iframeRef.current?.contentWindow?.postMessage({
      name: msg.data.name,
      body: {
        ...msg.data.body,
        rules,
      },
    }, "*");
  })

  return (
    <iframe id="sandbox" src="/sandboxes/index.html" ref={iframeRef}></iframe>
  );
}

export default OffscreenPage;