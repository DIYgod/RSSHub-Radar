import AsyncLock from "async-lock"

import { sendToContentScript } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { setupOffscreenDocument } from "~/lib/offscreen"
import report from "~/lib/report"
import type { RSSData } from "~/lib/types"
import { getRSSHub as sandboxGetRSSHub } from "~/sandboxes"

import { setBadge } from "./badge"

const storage = new Storage({
  area: "local",
})

const savedRSS: {
  [tabId: number]: {
    pageRSSHub: RSSData[]
    websiteRSSHub: RSSData[]
    pageRSS: RSSData[]
  }
} = {}

const lock = new AsyncLock({
  maxExecutionTime: 3000,
})
export const getRSS = async (tabId, url) => {
  if (!tabId || !url || !url.startsWith("http")) {
    return
  }
  try {
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
        tabId,
      })

      if (chrome.offscreen && chrome.runtime.getContexts) {
        await setupOffscreenDocument("tabs/offscreen.html")
        chrome.runtime.sendMessage({
          target: "offscreen",
          data: {
            name: "requestRSSHub",
            body: {
              tabId,
              html,
              url,
              rules: await storage.get("rules"),
            },
          },
        })
      } else {
        const rsshub = sandboxGetRSSHub({
          html,
          url,
          rules: await storage.get("rules"),
        })
        setRSS(tabId, rsshub)
      }

      const pageRSS = await sendToContentScript({
        name: "requestPageRSS",
        tabId,
      })
      setRSS(tabId, pageRSS)
    })
  } catch (error) {
    console.error(error)
  }
}

export const getCachedRSS = (tabId) => {
  return savedRSS[tabId]
}

export const setRSS = async (
  tabId,
  data: {
    pageRSS: RSSData[]
  } | {
    pageRSSHub: RSSData[]
    websiteRSSHub: RSSData[]
  },
) => {
  if (!data) {
    return
  }
  if (!savedRSS[tabId]) {
    savedRSS[tabId] = {
      pageRSS: [],
      pageRSSHub: [],
      websiteRSSHub: [],
    }
  }
  if ("pageRSS" in data) {
    savedRSS[tabId].pageRSS = data.pageRSS
  } else {
    savedRSS[tabId].pageRSSHub = data.pageRSSHub
    savedRSS[tabId].websiteRSSHub = data.websiteRSSHub
  }

  let text = ""
  if (savedRSS[tabId].pageRSS.length || savedRSS[tabId].pageRSSHub.length) {
    text =
      savedRSS[tabId].pageRSS.length +
      savedRSS[tabId].pageRSSHub.length +
      ""
  } else if (savedRSS[tabId].websiteRSSHub.length) {
    text = " "
  }
  setBadge(text, tabId)
}

export const deleteCachedRSS = (tabId) => {
  delete savedRSS[tabId]
}
