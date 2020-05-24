import { defaultConfig } from './config';
import defaultRules from './radar-rules';

export function refreshRules(success) {
    if (defaultConfig.enableRemoteRules) {
        fetch('https://raw.githubusercontent.com/DIYgod/RSSHub/master/assets/radar-rules.js').then((response) => {
            response.text().then((text) => {
                chrome.storage.local.set({
                    rules: text,
                    rulesDate: +new Date(),
                });
                success && success();
            });
        });
    } else {
        success && success();
    }
}

export function getRules(success) {
    if (defaultConfig.enableRemoteRules) {
        chrome.storage.local.get('rules', (result) => {
            if (result && result.rules) {
                success(result.rules);
            } else {
                refreshRules(() => {
                    getRules(success);
                });
            }
        });
    } else {
        success(defaultRules);
    }
}

export function getRulesDate(success) {
    chrome.storage.local.get('rulesDate', (result) => {
        if (result && result.rulesDate) {
            success(result.rulesDate);
        } else {
            success(null);
        }
    });
}

export function updateRules(text, success) {
    chrome.storage.local.set({
        rules: text,
    });
    success && success();
}
