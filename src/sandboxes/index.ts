import { getPageRSSHub, getWebsiteRSSHub } from "~/lib/rsshub"
import { parseRules } from "~/lib/rules"
import { removeFunctionFields } from "~/lib/utils"

export {}

export const getRSSHub = ({
  html,
  url,
  rules,
}: {
  html: string
  url: string
  rules: string
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
  return {
    pageRSSHub,
    websiteRSSHub,
  }
}

export const getDisplayedRules = (rules: string) => {
  const displayedRules = parseRules(rules)
  removeFunctionFields(displayedRules)
  return displayedRules
}

if (typeof window !== "undefined") {
  window.addEventListener(
    "message",
    (
      event: MessageEvent<
        | {
            name: "requestRSSHub"
            body: {
              html: string
              url: string
              rules: string
              tabId: number
            }
          }
        | {
            name: "requestDisplayedRules"
            body: {
              rules: string
            }
          }
      >,
    ) => {
      switch (event.data?.name) {
        case "requestRSSHub": {
          const rsshub = getRSSHub({
            html: event.data.body.html,
            url: event.data.body.url,
            rules: event.data.body.rules,
          })
          event.source.postMessage(
            {
              name: "responseRSS",
              body: {
                url: "url" in event.data.body && event.data.body.url,
                tabId: "tabId" in event.data.body && event.data.body.tabId,
                rss: rsshub,
              },
            },
            event.origin as any,
          )
          break
        }
        case "requestDisplayedRules": {
          const displayedRules = getDisplayedRules(event.data.body.rules)
          event.source.postMessage(
            {
              name: "responseDisplayedRules",
              body: {
                displayedRules,
              },
            },
            event.origin as any,
          )
          break
        }
      }
    },
  )
}
