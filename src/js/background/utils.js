window.pageRSS = [];
window.pageRSSHub = [];
window.websiteRSSHub = [];

chrome.browserAction.setBadgeBackgroundColor({
    color: '#FF2800',
});

function setBadge () {
    chrome.tabs.query({
        active: true,
        currentWindow: true,
    }, (tabs) => {
        chrome.browserAction.setBadgeText({
            text: (window.pageRSS.length + window.pageRSSHub.length) ? (window.pageRSS.length + window.pageRSSHub.length + '') : '',
            tabId: tabs[0].id,
        });
     });
}

function handlePageRSS (feeds) {
    window.pageRSS = feeds || [];
    setBadge();
}

function handlePageRSSHub (feeds) {
    window.pageRSSHub = feeds || [];
    setBadge();
}

function handleWebsiteRSSHub (feeds) {
    window.websiteRSSHub = feeds || [];
}

module.exports = {
    handlePageRSS,
    handlePageRSSHub,
    handleWebsiteRSSHub,
}