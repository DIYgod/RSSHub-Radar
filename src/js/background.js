window.pageRSS = [];
window.RSSHub = [];
let currentTab = null;

function handlePageRSS (feeds) {
    chrome.browserAction.setBadgeText({
        text: feeds.length ? (feeds.length + '') : '',
        tabId: currentTab.tabId,
    });
    window.pageRSS = feeds;
}

chrome.browserAction.setBadgeBackgroundColor({
    color: '#FF2800',
});

chrome.tabs.onActivated.addListener(function (tab) {
    currentTab = tab;
    chrome.tabs.sendMessage(currentTab.tabId, {
        text: 'getPageRSS',
    }, handlePageRSS);
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'setPageRSS' && sender.tab.active) {
        handlePageRSS(msg.feeds);
    }
});
