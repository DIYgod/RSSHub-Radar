import { getPageRSS } from "~/lib/rss"
import { getPageRSSHub, getWebsiteRSSHub } from "~/lib/rsshub"
import { parseRules } from '~/lib/rules';
import { removeFunctionFields } from "~/lib/utils"

export { }

console.log("HELLO WORLD FROM SANDBOXES")

window.addEventListener("message", async (event: MessageEvent<{
  name: "requestRSS"
  body: {
    html: string
    url: string
    rules: string
    tabId: number
  }
} | {
  name: "requestDisplayedRules"
  body: {
    rules: string
  }
}>) => {
  switch (event.data?.name) {
    case "requestRSS": {
      const pageRSSHub = getPageRSSHub({
        html: event.data.body.html,
        url: event.data.body.url,
        rules: event.data.body.rules,
      })
      const websiteRSSHub = getWebsiteRSSHub({
        url: event.data.body.url,
        rules: event.data.body.rules,
      })
      event.source.postMessage({
        name: "responseRSS",
        body: {
          url: event.data.body.url,
          tabId: event.data.body.tabId,
          rss: {
            pageRSS: [],
            pageRSSHub,
            websiteRSSHub,
          }
        },
      }, event.origin as any)
      const pageRSS = await getPageRSS({
        html: event.data.body.html,
        url: event.data.body.url,
      })
      event.source.postMessage({
        name: "responseRSS",
        body: {
          url: event.data.body.url,
          tabId: event.data.body.tabId,
          rss: {
            pageRSS,
            pageRSSHub,
            websiteRSSHub,
          }
        },
      }, event.origin as any)
      break
    }
    case "requestDisplayedRules": {
      const displayedRules = parseRules(event.data.body.rules)
      removeFunctionFields(displayedRules)
      console.debug("requestDisplayedRules", displayedRules)
      event.source.postMessage({
        name: "responseDisplayedRules",
        body: {
          displayedRules,
        },
      }, event.origin as any)
      break
    }
  }
})
