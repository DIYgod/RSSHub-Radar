import { sendToContentScript } from "@plasmohq/messaging"
import { setupOffscreenDocument } from "./offscreen"

export {}
console.log("HELLO WORLD FROM BGSCRIPTS")

const getRSS = async (tabId, url) => {
  console.debug("Get RSS", tabId, url)
  await setupOffscreenDocument("tabs/offscreen.html")

  console.debug("Send to content script requestHTML")
  const html = await sendToContentScript({
    name: "requestHTML"
  })

  console.debug("Get html", html)
  console.debug("Send to offscreen")
  chrome.runtime.sendMessage({
    target: "offscreen",
    data: {
      name: "requestRSS",
      body: {
        html,
        url,
      }
    }
  })
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
  if (changeInfo.url && tab.active) {
    getRSS(tabId, changeInfo.url);
  }
})

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

// chrome.tabs.onRemoved.addListener((tabId) => {
//     removeRSS(tabId);
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
