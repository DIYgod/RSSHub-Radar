import { sendToBackground } from "~/lib/messaging"
import { getPageRSS } from "~/lib/rss"

sendToBackground({
  name: "contentReady",
}).catch((error) => {
  console.error("Failed to notify background that content is ready", error)
})

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.name === "requestHTML") {
    sendResponse(document.documentElement.outerHTML)
  } else if (msg.name === "requestPageRSS") {
    getPageRSS()
      .then((data) => {
        sendResponse(data)
      })
      .catch((error) => {
        console.error("Failed to inspect page feeds", error)
        sendResponse({ pageRSS: [] })
      })
    return true
  }
})

export {}
