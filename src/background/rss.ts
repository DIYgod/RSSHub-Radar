import AsyncLock from "async-lock"

import { sendToContentScript } from "~/lib/messaging"
import { setupOffscreenDocument } from "~/lib/offscreen"
import report from "~/lib/report"
import { getLocalStorage } from "~/lib/storage"
import type { RSSData } from "~/lib/types"
import { isLikelyFeedUrl, parseRSS } from "~/lib/utils"
import { getRSSHub as sandboxGetRSSHub } from "~/tabs/sandboxes"

import { setBadge } from "./badge"

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

const requestContentScript = async <T>(name: string, tabId: number) => {
  try {
    return await sendToContentScript<T>({
      name,
      tabId,
    })
  } catch (error) {
    // Content scripts are not injected into every tab (for example, existing
    // tabs after an extension reload). contentReady retries once they are.
    if (
      error instanceof Error &&
      error.message.includes("Receiving end does not exist")
    ) {
      return
    }
    throw error
  }
}

const isTabComplete = (tabId: number) =>
  new Promise<boolean>((resolve) => {
    chrome.tabs.get(tabId, (tab) => {
      resolve(!chrome.runtime.lastError && tab?.status === "complete")
    })
  })

const getDirectFeed = async (url: string) => {
  try {
    // This request is made outside the page, so it must never send or replace
    // the site's cookies: that would rotate session, CSRF or captcha state.
    const response = await fetch(url, {
      credentials: "omit",
    })
    const content = await response.text()
    const prefix = content.slice(0, 4096)
    if (!/^\s*(?:<\?xml[^>]*>\s*)?<(?:rss|feed)\b/i.test(prefix)) {
      return
    }

    const parsed = parseRSS(content)
    if (!parsed) {
      return
    }

    return {
      url,
      title: parsed.title,
      image: `https://icons.duckduckgo.com/ip3/${new URL(url).hostname}.ico`,
    }
  } catch (error) {
    console.error("Failed to inspect direct feed", error)
  }
}

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
      const html = await requestContentScript<string>("requestHTML", tabId)
      if (typeof html !== "string") {
        // No content script: the page is still loading (contentReady runs the
        // detection once it is ready), was opened before the extension was
        // installed or updated, or blocks extensions. Only fall back to
        // requesting the URL when the page has loaded and looks like a feed, so
        // ordinary pages such as login forms are never requested a second time
        // (#1192, #1193).
        if (isLikelyFeedUrl(url) && (await isTabComplete(tabId))) {
          const directFeed = await getDirectFeed(url)
          if (directFeed) {
            setRSS(tabId, {
              pageRSS: [directFeed],
            })
          }
        }
        return
      }

      if (chrome.offscreen && (chrome.runtime as any).getContexts) {
        await setupOffscreenDocument("offscreen.html")
        await chrome.runtime.sendMessage({
          target: "offscreen",
          data: {
            name: "requestRSSHub",
            body: {
              tabId,
              html,
              url,
              rules: await getLocalStorage("rules"),
            },
          },
        })
      } else {
        const rsshub = sandboxGetRSSHub({
          html,
          url,
          rules: await getLocalStorage("rules"),
        })
        setRSS(tabId, rsshub)
      }

      const pageRSS = await requestContentScript<{ pageRSS: RSSData[] }>(
        "requestPageRSS",
        tabId,
      )
      // The content script reads the document already loaded in the tab,
      // including feeds opened directly, so never request the page again here.
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
  data:
    | {
        pageRSS: RSSData[]
      }
    | {
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
      savedRSS[tabId].pageRSS.length + savedRSS[tabId].pageRSSHub.length + ""
  } else if (savedRSS[tabId].websiteRSSHub.length) {
    text = " "
  }
  setBadge(text, tabId)
}

export const deleteCachedRSS = (tabId) => {
  delete savedRSS[tabId]
}
