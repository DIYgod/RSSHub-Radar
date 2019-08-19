import { handleRSS, removeRSS, addPageRSS, getAllRSS } from './utils';
import { getConfig, saveConfig } from '../common/config';

chrome.tabs.onActivated.addListener((tab) => {
    chrome.tabs.sendMessage(
        tab.tabId,
        {
            text: 'getPageRSS',
        },
        (feeds) => {
            handleRSS(feeds, tab.tabId, true);
        }
    );
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && tab.active) {
        chrome.tabs.sendMessage(
            tab.id,
            {
                text: 'getPageRSS',
            },
            (feeds) => {
                handleRSS(feeds, tab.id);
            }
        );
    }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (sender.tab && sender.tab.active) {
        if (msg.text === 'setPageRSS') {
            handleRSS(msg.feeds, sender.tab.id);
        } else if (msg.text === 'addPageRSS') {
            addPageRSS(msg.feed, sender.tab.id);
        }
    }
    if (msg.text === 'getAllRSS') {
        sendResponse(getAllRSS(msg.tabId));
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    removeRSS(tabId);
});

getConfig((config) => {
    if (!config.version) {
        config.version = VERSION;
        saveConfig(config);
    } else if (config.version !== VERSION) {
        chrome.notifications.create('RSSHubRadarUpdate', {
            type: 'basic',
            iconUrl: './rsshub.png',
            title: '🎉 RSSHub Radar 更新',
            message: `v${VERSION}，点击查看更新日志`,
        });
        chrome.notifications.onClicked.addListener((id) => {
            if (id === 'RSSHubRadarUpdate') {
                chrome.tabs.create({
                    url: 'https://github.com/DIYgod/RSSHub-Radar/releases',
                });
                chrome.notifications.clear('RSSHubRadarUpdate');
            }
        });
        config.version = VERSION;
        saveConfig(config);
    }
});
