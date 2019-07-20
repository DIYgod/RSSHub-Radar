import { handlePageRSS, handlePageRSSHub, handleWebsiteRSSHub } from './utils';
import rules from './rules';

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
