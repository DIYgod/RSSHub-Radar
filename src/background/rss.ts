import AsyncLock from "async-lock"

import { sendToContentScript } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { setupOffscreenDocument } from "~/lib/offscreen"
import type { RSSData } from "~/lib/types"
import { getRSS as sandboxGetRSS } from "~/sandboxes"
import report from "~/lib/report"

import { setBadge } from "./badge"

const storage = new Storage({
  area: "local"
})

const savedRSS: {
  [tabId: number]: {
    pageRSS: RSSData[]
    pageRSSHub: RSSData[]
    websiteRSSHub: RSSData[]
  }
} = {}

const lock = new AsyncLock()
export const getRSS = async (tabId, url) => {
  await lock.acquire(tabId, async () => {
    if (savedRSS[tabId]) {
      setRSS(tabId, savedRSS[tabId])
      return
    }

    report({
      url,
    })
    const html = await sendToContentScript({
      name: "requestHTML",
      tabId
    })

    if (chrome.offscreen) {
      await setupOffscreenDocument("tabs/offscreen.html")
      chrome.runtime.sendMessage({
        target: "offscreen",
        data: {
          name: "requestRSS",
          body: {
            tabId,
            html,
            url,
            rules: await storage.get("rules")
          }
        }
      })

      await new Promise((resolve) => setTimeout(resolve, 100))
    } else {
      sandboxGetRSS({
        html,
        url,
        rules: await storage.get("rules"),
        callback: (rss) => setRSS(tabId, rss)
      })
    }
  })
}

export const getCachedRSS = (tabId) => {
  return savedRSS[tabId]
}

function applyRSS(
  tabId,
  data: {
    pageRSS: RSSData[]
    pageRSSHub: RSSData[]
    websiteRSSHub: RSSData[]
  }
) {
  savedRSS[tabId] = data

  let text = ""
  if (data.pageRSS.length || data.pageRSSHub.length) {
    text =
      data.pageRSS.filter((rss) => !rss.uncertain).length +
      data.pageRSSHub.length +
      ""
  } else if (data.websiteRSSHub.length) {
    text = " "
  }
  setBadge(text, tabId)
}

export const setRSS = async (
  tabId,
  data: {
    pageRSS: RSSData[]
    pageRSSHub: RSSData[]
    websiteRSSHub: RSSData[]
  }
) => {
  applyRSS(tabId, data)

  const res = await sendToContentScript({
    name: "parseRSS",
    tabId,
    body: data.pageRSS.filter((rss) => rss.uncertain).map((rss) => rss.url)
  })
  data.pageRSS = data.pageRSS.filter((rss) => {
    if (rss.uncertain) {
      const parsed = res.find((r) => r.url === rss.url)
      if (parsed && parsed.title !== null) {
        if (parsed.title) {
          rss.title = parsed.title
        }
        rss.uncertain = false
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  })

  applyRSS(tabId, data)
}

export const deleteCachedRSS = (tabId) => {
  delete savedRSS[tabId]
}
