import { handleRSS } from './utils';

chrome.tabs.onActivated.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.tabId, {
        text: 'getPageRSS',
    }, handleRSS);
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'setPageRSS' && sender.tab.active) {
        handleRSS(msg.feeds);
    }
});
