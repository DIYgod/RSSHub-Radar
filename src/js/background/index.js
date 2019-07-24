import { handleRSS, removeRSS } from './utils';

chrome.tabs.onActivated.addListener((tab) => {
    chrome.tabs.sendMessage(tab.tabId, {
        text: 'getPageRSS',
    }, (feeds) => {
        handleRSS(feeds, tab.tabId, true);
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && tab.active) {
        chrome.tabs.sendMessage(tab.id, {
            text: 'getPageRSS',
        }, (feeds) => {
            handleRSS(feeds, tab.id);
        });
    }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.text === 'setPageRSS' && sender.tab.active) {
        handleRSS(msg.feeds, sender.tab.id);
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    removeRSS(tabId);
});