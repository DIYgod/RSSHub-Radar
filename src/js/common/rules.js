let rules = null;

export function refreshRules (success) {
    fetch('https://raw.githubusercontent.com/DIYgod/RSSHub/master/assets/radar-rules.js')
        .then((response) => {
            response.text()
                .then((text) => {
                    rules = eval(text);
                    chrome.storage.local.set({
                        rules: text,
                        rulesDate: +new Date(),
                    });
                    success && success();
                });
        });
}

export function getRules (success) {
    if (rules) {
        success(rules);
    } else {
        chrome.storage.local.get('rules', (result) => {
            if (result && result.rules) {
                rules = eval(result.rules);
                success(rules);
            } else {
                refreshRules(() => {
                    success(rules);
                });
            }
        });
    }
}

export function getRulesDate (success) {
    chrome.storage.local.get('rulesDate', (result) => {
        if (result && result.rulesDate) {
            success(result.rulesDate);
        } else {
            success(null);
        }
    });
}