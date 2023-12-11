import type { Rules } from "~/lib/types"
import { getPageRSS } from "~/lib/rss"
import { getPageRSSHub, getWebsiteRSSHub } from "~/lib/rsshub"

export { }

console.log("HELLO WORLD FROM SANDBOXES")

window.addEventListener("message", async (event: MessageEvent<{
  name: string
  body: {
    html: string
    url: string
    rules: Rules
    tabId: number
  }
}>) => {
  if (event.data?.name === "requestRSS") {
    const pageRSS = await getPageRSS({
      html: event.data.body.html,
      url: event.data.body.url,
    })
    const pageRSSHub = getPageRSSHub({
      html: event.data.body.html,
      url: event.data.body.url,
      rules: event.data.body.rules,
    })
    const websiteRSSHub = getWebsiteRSSHub({
      url: event.data.body.url,
      rules: event.data.body.rules,
    })
    console.log("RSS", pageRSS, pageRSSHub, websiteRSSHub)
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
  }
})
