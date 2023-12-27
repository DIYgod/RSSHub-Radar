import { sendToBackground } from "@plasmohq/messaging"

sendToBackground({
  name: "contentReady",
})

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.name === "requestHTML") {
    sendResponse(document.documentElement.outerHTML)
  }
})

export { }
