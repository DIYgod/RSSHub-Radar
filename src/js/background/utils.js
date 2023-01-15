import { getRules, getRulesDate, refreshRules } from '../common/rules';
import { commandSandbox } from '../common/utils';
import { getConfig } from '../common/config';
let config;
let rules = {};
import RSSParser from 'rss-parser';
const rssParser = new RSSParser();

window.pageRSS = {};
window.pageRSSHub = {};
window.websiteRSSHub = {};

function schedule(time = +new Date() + config.refreshTimeout * 1000) {
    chrome.alarms.create('refreshRules', {
        when: time,
        periodInMinutes: config.refreshTimeout / 60,
    });
}

function initSchedule() {
    getRulesDate((lastDate) => {
        if (!lastDate || +new Date() - lastDate > config.refreshTimeout * 1000) {
            refreshRules();
            schedule();
        } else {
            schedule(lastDate + config.refreshTimeout * 1000);
        }
    });
}

chrome.storage.onChanged.addListener((result) => {
    if (result.config) {
        config = result.config.newValue;
    }
    if (result.rules) {
        getRules((rul) => {
            rules = rul;
        });
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'refreshRules') {
        refreshRules();
    }
});

if ('idle' in chrome) {
    chrome.idle.onStateChanged.addListener((newState) => {
        if (newState === 'active') {
            initSchedule();
        }
    });
}

getConfig((conf) => {
    config = conf;

    getRules((rul) => {
        rules = rul;
        initSchedule();
    });
});

chrome.browserAction.setBadgeBackgroundColor({
    color: '#F62800',
});

chrome.browserAction.setBadgeTextColor &&
    chrome.browserAction.setBadgeTextColor({
        color: '#fff',
    });

function setBadge(tabId) {
    chrome.browserAction.setBadgeText({
        text: config.notice.badge ? (window.pageRSS[tabId].length + (window.pageRSSHub[tabId] ? window.pageRSSHub[tabId].length : 0) || (window.websiteRSSHub[tabId] && window.websiteRSSHub[tabId].length ? ' ' : '')) + '' : '',
        tabId,
    });
}

function getPageRSSHub(url, tabId, done) {
    chrome.tabs.sendMessage(
        tabId,
        {
            text: 'getHTML',
        },
        (html) => {
            commandSandbox(
                'getPageRSSHub',
                {
                    url,
                    html,
                    rules,
                },
                done
            );
        }
    );
}

function getWebsiteRSSHub(url, done) {
    commandSandbox(
        'getWebsiteRSSHub',
        {
            url,
            rules,
        },
        done
    );
}

export function handleRSS(feeds, tabId, useCache) {
    if (useCache && window.pageRSS[tabId]) {
        setBadge(tabId);
    } else {
        chrome.tabs.get(tabId, (tab) => {
            feeds &&
                feeds.forEach((feed) => {
                    feed.image = tab.favIconUrl || feed.image;
                });
            window.pageRSS[tabId] = (feeds && feeds.filter((feed) => !feed.uncertain)) || [];

            getWebsiteRSSHub(tab.url, (feeds) => {
                window.websiteRSSHub[tabId] = feeds || [];
                setBadge(tabId);
            });

            getPageRSSHub(tab.url, tabId, (feeds) => {
                window.pageRSSHub[tabId] = feeds || [];
                setBadge(tabId);
            });
        });

        feeds &&
            feeds
                .filter((feed) => feed.uncertain)
                .forEach((feed) => {
                    rssParser.parseURL(feed.url, (err, result) => {
                        if (!err) {
                            feed.title = result.title;
                            window.pageRSS[tabId].push(feed);
                            setBadge(tabId);
                        }
                    });
                });
    }
}

export function removeRSS(tabId) {
    delete window.pageRSS[tabId];
    delete window.websiteRSSHub[tabId];
    delete window.pageRSSHub[tabId];
}

export function addPageRSS(feed, tabId) {
    if (feed) {
        chrome.tabs.get(tabId, (tab) => {
            feed.image = tab.favIconUrl || feed.image;
            window.pageRSS[tabId].push(feed);
            setBadge(tabId);
        });
    }
}

export function getAllRSS(tabId) {
    return {
        pageRSS: window.pageRSS[tabId] || {},
        websiteRSSHub: window.websiteRSSHub[tabId] || {},
        pageRSSHub: window.pageRSSHub[tabId] || {},
    };
}
