import { defaultConfig, getConfig } from './config';
import defaultRules from './radar-rules';

function _refreshRules(config, success) {
    if (defaultConfig.enableRemoteRules) {
        const done = (response) => {
            response.text().then((text) => {
                chrome.storage.local.set({
                    rules: text,
                    rulesDate: +new Date(),
                });
                success && success();
            });
        };
        if (config.customrule.enable) {
            fetch(config.customrule.url).then((response) => {
                done(response);
            });
        } else {
            fetch('https://raw.githubusercontent.com/DIYgod/RSSHub/master/assets/radar-rules.js')
                .then((response) => {
                    done(response);
                })
                .catch(() => {
                    fetch('https://cdn.jsdelivr.net/gh/DIYgod/RSSHub@master/assets/radar-rules.js').then((response) => {
                        done(response);
                    });
                });
        }
    } else {
        success && success();
    }
}

export function refreshRules(success) {
    getConfig((config) => {
        _refreshRules(config, success);
    });
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
