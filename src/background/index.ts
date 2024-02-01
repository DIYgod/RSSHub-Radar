import { deleteCachedRSS, getRSS } from "./rss"
import { initSchedule } from "./rules"
import { initUpdateNotifications } from "./update-notifications"

export {}

chrome.tabs.onActivated.addListener((tab) => {
  chrome.tabs.get(tab.tabId, (info) => {
    if (info.url) {
      getRSS(tab.tabId, info.url)
    }
  })
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active) {
    if (changeInfo.url) {
      deleteCachedRSS(tabId)
      getRSS(tabId, changeInfo.url)
    } else if (changeInfo.status === "loading") {
      deleteCachedRSS(tabId)
    } else if (changeInfo.status === "complete") {
      getRSS(tabId, tab.url)
    }
  }
})

chrome.tabs.onRemoved.addListener((tabId) => {
  deleteCachedRSS(tabId)
})

initSchedule()
initUpdateNotifications()
