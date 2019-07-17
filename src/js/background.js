function handlePageRSS (feeds) {
    if (feeds && feeds.length) {
        chrome.browserAction.setBadgeText({
            text: feeds.length + '',
        });
    } else {
        chrome.browserAction.setBadgeText({
            text: '',
        });
    }
}

chrome.browserAction.setBadgeBackgroundColor({
    color: '#FF2800',
});

chrome.tabs.onActivated.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.tabId, {
        text: 'getPageRSS',
    }, handlePageRSS);
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'setPageRSS' && sender.tab.active) {
        handlePageRSS(msg.feeds);
    }
});
