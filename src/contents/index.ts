import { sendToBackground } from "@plasmohq/messaging"

import { fetchRSSContent, parseRSS } from "~/lib/utils"

sendToBackground({
  name: "contentReady",
})

async function getRSS(url) {
  let title = null
  try {
    const content = await fetchRSSContent(url)
    const result = parseRSS(content)
    if (result) {
      title = result.title || ""
    }
  } catch (error) {}

  return {
    url,
    title,
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.name === "requestHTML") {
    sendResponse(document.documentElement.outerHTML)
  } else if (msg.name === "parseRSS") {
    Promise.all(msg.body?.map(getRSS)).then((data) => {
      sendResponse(data)
    })
    return true
  }
})

export {}
