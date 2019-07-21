import rules from './rules';

window.pageRSS = [];
window.pageRSSHub = [];
window.websiteRSSHub = [];

chrome.browserAction.setBadgeBackgroundColor({
    color: '#FF2800',
});

function setBadge (id) {
    chrome.browserAction.setBadgeText({
        text: ((window.pageRSS.length + window.pageRSSHub.length) || '') + '',
        tabId: id,
    });
}

function getPageRSSHub (url, done) {
    console.log(url);
    done([]);
}

function getWebsiteRSSHub (url) {
    return [];
}

export function handleRSS (feeds) {
    chrome.tabs.query({
        active: true,
        currentWindow: true,
    }, (tabs) => {
        console.log(tabs);
        const currentTab = tabs[0];

        feeds && feeds.forEach((feed) => {
            feed.image = currentTab.favIconUrl || feed.image;
        });
        window.pageRSS = feeds || [];

        getPageRSSHub(currentTab.url, (feeds) => {
            window.pageRSSHub = feeds || [];
            setBadge(currentTab.id);
        });

        window.websiteRSSHub = getWebsiteRSSHub(currentTab.url) || [];

        setBadge(currentTab.id);
    });
}