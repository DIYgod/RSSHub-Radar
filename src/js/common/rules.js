export function refreshRules(success) {
    fetch('https://raw.githubusercontent.com/DIYgod/RSSHub/master/assets/radar-rules.js').then((response) => {
        response.text().then((text) => {
            chrome.storage.local.set({
                rules: text,
                rulesDate: +new Date(),
            });
            success && success();
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
