import { getPageRSS, runCode } from './utils';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.text === 'getPageRSS') {
        sendResponse(getPageRSS());
    } else if (msg.text === 'executeScript') {
        sendResponse(runCode(msg.code));
    }
});

chrome.runtime.sendMessage(null, {
    text: 'setPageRSS',
    feeds: getPageRSS(),
});