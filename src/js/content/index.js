import { getPageRSS } from './utils';

chrome.runtime.sendMessage(null, {
    text: 'setPageRSS',
    feeds: getPageRSS(),
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.text === 'getPageRSS') {
        sendResponse(getPageRSS());
    }
});