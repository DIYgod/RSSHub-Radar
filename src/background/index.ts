import contentReady from "./messages/contentReady"
import popupReady from "./messages/popupReady"
import refreshRules from "./messages/refreshRules"
import requestDisplayedRules from "./messages/requestDisplayedRules"
import responseDisplayedRules from "./messages/responseDisplayedRules"
import responseRSS from "./messages/responseRSS"
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

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const run = async () => {
    switch (msg?.name) {
      case "contentReady":
        return contentReady(msg, sender)
      case "popupReady":
        return popupReady(msg, sender)
      case "refreshRules":
        return refreshRules(msg, sender)
      case "requestDisplayedRules":
        return requestDisplayedRules(msg, sender)
      case "responseDisplayedRules":
        return responseDisplayedRules(msg, sender)
      case "responseRSS":
        return responseRSS(msg, sender)
      default:
        return undefined
    }
  }

  run()
    .then((res) => {
      sendResponse(res)
    })
    .catch((error) => {
      console.error(error)
      sendResponse(undefined)
    })

  return true
})

initSchedule()
initUpdateNotifications()
