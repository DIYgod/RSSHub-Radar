import { getPageRSS, runCode } from './utils';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.text === 'getPageRSS') {
        sendResponse(getPageRSS());
    } else if (msg.text === 'executeScript') {
        sendResponse(runCode(msg.code));
    } else if (msg.text === 'getHTML') {
        sendResponse(document.documentElement.innerHTML);
    }
});

chrome.runtime.sendMessage(null, {
    text: 'setPageRSS',
    feeds: getPageRSS(),
});
