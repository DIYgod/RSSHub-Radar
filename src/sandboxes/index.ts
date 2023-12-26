import { getPageRSS } from "~/lib/rss"
import { getPageRSSHub, getWebsiteRSSHub } from "~/lib/rsshub"
import { parseRules } from '~/lib/rules';
import { removeFunctionFields } from "~/lib/utils"

export { }

console.log("HELLO WORLD FROM SANDBOXES")

export const getRSS = async ({
  html,
  url,
  rules,
  callback,
}: {
  html: string
  url: string
  rules: string
  callback
}) => {
  const pageRSSHub = getPageRSSHub({
    html,
    url,
    rules,
  })
  const websiteRSSHub = getWebsiteRSSHub({
    url,
    rules,
  })
  callback({
    pageRSS: [],
    pageRSSHub,
    websiteRSSHub,
  })
  const pageRSS = await getPageRSS({
    html,
    url,
  })
  callback({
    pageRSS,
    pageRSSHub,
    websiteRSSHub,
  })
}

export const getDisplayedRules = (rules: string) => {
  const displayedRules = parseRules(rules)
  removeFunctionFields(displayedRules)
  console.debug("requestDisplayedRules", displayedRules)
  return displayedRules
}

if (typeof window !== "undefined") {
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
        getRSS({
          html: event.data.body.html,
          url: event.data.body.url,
          rules: event.data.body.rules,
          callback: (rss) => {
            event.source.postMessage({
              name: "responseRSS",
              body: {
                url: 'url' in event.data.body && event.data.body.url,
                tabId: 'tabId' in event.data.body && event.data.body.tabId,
                rss,
              },
            }, event.origin as any)
          },
        })
        break
      }
      case "requestDisplayedRules": {
        const displayedRules = getDisplayedRules(event.data.body.rules)
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
}