import { sendToBackground } from "@plasmohq/messaging"

import { getPageRSS } from "~/lib/rss"

sendToBackground({
  name: "contentReady",
})

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.name === "requestHTML") {
    sendResponse(document.documentElement.outerHTML)
  } else if (msg.name === "requestPageRSS") {
    getPageRSS().then((data) => {
      sendResponse(data)
    })
    return true
  }
})

export {}
