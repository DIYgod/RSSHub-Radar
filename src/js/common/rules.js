import { defaultConfig } from './config';

export function refreshRules(success) {
    const done = (response) => {
        response.text().then((text) => {
            chrome.storage.local.set({
                rules: text,
                rulesDate: +new Date(),
            });
            success && success();
        });
    };
    fetch(`https://rsshub.js.org/build/radar-rules.${defaultConfig.enableFullRemoteRules ? 'js' : 'json'}`)
        .then((response) => {
            done(response);
        })
        .catch(() => {
            fetch(`https://cdn.jsdelivr.net/gh/DIYgod/RSSHub@gh-pages/build/radar-rules.${defaultConfig.enableFullRemoteRules ? 'js' : 'json'}`).then((response) => {
                done(response);
            });
        });
}

export function getRules(success) {
    chrome.storage.local.get('rules', (result) => {
        if (result && result.rules) {
            success(result.rules);
        } else {
            refreshRules(() => {
                getRules(success);
            });
        }
    });
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
