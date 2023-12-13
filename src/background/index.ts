import { sendToContentScript } from "@plasmohq/messaging"
import { setupOffscreenDocument } from "~/lib/offscreen"
import type { RSSData } from "~/lib/types";
import { Storage } from "@plasmohq/storage"
import AsyncLock from "async-lock"

export {}
console.log("HELLO WORLD FROM BGSCRIPTS")

const savedRSS: {
  [tabId: number]: {
    pageRSS: RSSData[],
    pageRSSHub: RSSData[],
    websiteRSSHub: RSSData[],
  }
} = {}

chrome.action.setBadgeBackgroundColor({
  color: '#F62800',
});

chrome.action.setBadgeTextColor({
    color: '#fff',
});

const storage = new Storage({
  area: "local"
})

export const getRules = () => storage.get("rules")

const lock = new AsyncLock();
export const getRSS = async (tabId, url) => {
  console.debug("Get RSS", tabId, url)

  if (savedRSS[tabId]) {
    console.debug("Already have RSS", savedRSS[tabId])
    setRSS(tabId, savedRSS[tabId])
    return
  } else {
    await lock.acquire(tabId, async () => {
      await setupOffscreenDocument("tabs/offscreen.html")
  
      console.debug("Send to content script requestHTML")
      const html = await sendToContentScript({
        name: "requestHTML",
        tabId,
      })

      console.debug("Get html", html)
      console.debug("Send to offscreen")
      chrome.runtime.sendMessage({
        target: "offscreen",
        data: {
          name: "requestRSS",
          body: {
            tabId,
            html,
            url,
            rules: await getRules(),
          }
        }
      })
    })
  }
}

export const getCachedRSS = (tabId) => {
  return savedRSS[tabId]
}

export const setRSS = (tabId, data: {
  pageRSS: RSSData[],
  pageRSSHub: RSSData[],
  websiteRSSHub: RSSData[],
}) => {
  console.debug("Set RSS", tabId, data)

  savedRSS[tabId] = data

  let text = ''
  if (data.pageRSS.length || data.pageRSSHub.length) {
    text = (data.pageRSS.length + data.pageRSSHub.length) + ''
  } else if (data.websiteRSSHub.length) {
    text = ' '
  }
  chrome.action.setBadgeText({
    text,
    tabId,
  });
}

chrome.tabs.onActivated.addListener((tab) => {
  console.debug("Tab activated", tab)
  chrome.tabs.get(tab.tabId, (info) => {
    if (info.url) {
      getRSS(tab.tabId, info.url);
    }
  });
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active) {
    if (changeInfo.url) {
      delete savedRSS[tabId];
      getRSS(tabId, changeInfo.url);
    } else if (changeInfo.status === "loading") {
      delete savedRSS[tabId];
    } else if (changeInfo.status === "complete") {
      getRSS(tabId, changeInfo.url);
    }
  }
})

chrome.tabs.onRemoved.addListener((tabId) => {
  delete savedRSS[tabId]
});

// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//     if (sender.tab && sender.tab.active) {
//         if (msg.text === 'setPageRSS') {
//             handleRSS(msg.feeds, sender.tab.id);
//         } else if (msg.text === 'addPageRSS') {
//             addPageRSS(msg.feed, sender.tab.id);
//         }
//     }
//     if (msg.text === 'getAllRSS') {
//         sendResponse(getAllRSS(msg.tabId));
//     }
// });

// getConfig((config) => {
//     if (!config.version) {
//         config.version = VERSION;
//         saveConfig(config);
//     } else if (config.version !== VERSION) {
//         chrome.notifications.create('RSSHubRadarUpdate', {
//             type: 'basic',
//             iconUrl: './rsshub.png',
//             title: '🎉 RSSHub Radar 更新',
//             message: `v${VERSION}，点击查看更新日志`,
//         });
//         chrome.notifications.onClicked.addListener((id) => {
//             if (id === 'RSSHubRadarUpdate') {
//                 chrome.tabs.create({
//                     url: 'https://github.com/DIYgod/RSSHub-Radar/releases',
//                 });
//                 chrome.notifications.clear('RSSHubRadarUpdate');
//             }
//         });
//         config.version = VERSION;
//         saveConfig(config);
//     }
// });
