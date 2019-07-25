import rules from './rules';
import parseDomain from 'parse-domain';
import RouteRecognizer from 'route-recognizer';

window.pageRSS = {};
window.pageRSSHub = {};
window.websiteRSSHub = {};

chrome.browserAction.setBadgeBackgroundColor({
    color: '#FF2800',
});

function setBadge (tabId) {
    chrome.browserAction.setBadgeText({
        text: ((window.pageRSS[tabId].length + window.pageRSSHub[tabId].length) || (window.websiteRSSHub[tabId].length ? ' ' : '')) + '',
        tabId,
    });
}

function ruleHandler (rule, params, tabId, url, success, fail) {
    const run = () => {
        let reaultWithParams;
        if (typeof rule.target === 'function') {
            reaultWithParams = rule.target(params, url);
        } else if (typeof rule.target === 'string') {
            reaultWithParams = rule.target;
        }
    
        if (reaultWithParams) {
            for (const param in params) {
                reaultWithParams = reaultWithParams.replace(`/:${param}`, `/${params[param]}`);
            }
        }
    
        return reaultWithParams;
    }
    if (rule.script) {
        chrome.tabs.sendMessage(tabId, {
            text: 'executeScript',
            code: rule.script
        }, (result) => {
            params = Object.assign({}, result, params);
            if (!rule.verification || rule.verification(params)) {
                success(run());
            } else {
                fail();
            }
        });
    } else {
        if (!rule.verification || rule.verification(params)) {
            success(run());
        } else {
            fail();
        }
    }
}

function getPageRSSHub (url, tabId, done) {
    const parsedDomain = parseDomain(url);
    if (parsedDomain) {
        const subdomain = parsedDomain.subdomain;
        const domain = parsedDomain.domain + '.' + parsedDomain.tld;
        if (rules[domain] && rules[domain][subdomain || '.']) {
            const rule = rules[domain][subdomain || '.'];
            const recognized = [];
            rule.forEach((ru, index) => {
                if (ru.source !== undefined) {
                    if (ru.source instanceof Array) {
                        ru.source.forEach((source) => {
                            const router = new RouteRecognizer();
                            router.add([{
                                path: source,
                                handler: index,
                            }]);
                            const result = router.recognize(new URL(url).pathname.replace(/\/$/, ''));
                            if (result && result[0]) {
                                recognized.push(result[0]);
                            }
                        });
                    } else if (typeof ru.source === 'string') {
                        const router = new RouteRecognizer();
                        router.add([{
                            path: ru.source,
                            handler: index,
                        }]);
                        const result = router.recognize(new URL(url).pathname.replace(/\/$/, ''));
                        if (result && result[0]) {
                            recognized.push(result[0]);
                        }
                    }
                }
            });
            const result = [];
            Promise.all(recognized.map((recog) => {
                return new Promise((resolve) => {
                    ruleHandler(rule[recog.handler], recog.params, tabId, url, (parsed) => {
                        if (parsed) {
                            result.push({
                                title: formatBlank(rules[domain]._name ? '当前' : '', rule[recog.handler].title),
                                url: 'https://rsshub.app' + parsed,
                            });
                        } else {
                            result.push({
                                title: formatBlank(rules[domain]._name ? '当前' : '', rule[recog.handler].title),
                                url: rule[recog.handler].description,
                                isDescription: true,
                            });
                        }
                        resolve();
                    }, () => {
                        resolve();
                    });
                });
            })).then(() => {
                done(result);
            });
        } else {
            done([]);
        }
    } else {
        done([]);
    }
}

function formatBlank (str1, str2) {
    if (str1 && str2) {
        return str1 + ((str1[str1.length - 1].match(/[a-zA-Z0-9]/) || str2[0].match(/[a-zA-Z0-9]/)) ? ' ' : '') + str2;
    } else {
        return (str1 || '') + (str2 || '');
    }
}

function getWebsiteRSSHub (url) {
    const parsedDomain = parseDomain(url);
    if (parsedDomain) {
        const domain = parsedDomain.domain + '.' + parsedDomain.tld;
        if (rules[domain]) {
            const domainRules = [];
            for (const subdomainRules in rules[domain]) {
                if (subdomainRules[0] !== '_') {
                    domainRules.push(...rules[domain][subdomainRules]);
                }
            }
            return domainRules.map((rule) => ({
                title: formatBlank(rules[domain]._name, rule.title),
                url: rule.description,
                isDescription: true,
            }));
        } else {
            return [];
        }
    } else {
        return [];
    }
}

export function handleRSS (feeds, tabId, useCache) {
    if (useCache && window.pageRSS[tabId]) {
        setBadge(tabId);
    } else {
        chrome.tabs.get(tabId, (tab) => {
            feeds && feeds.forEach((feed) => {
                feed.image = tab.favIconUrl || feed.image;
            });
            window.pageRSS[tabId] = feeds || [];
    
            window.websiteRSSHub[tabId] = getWebsiteRSSHub(tab.url) || [];
    
            getPageRSSHub(tab.url, tabId, (feeds) => {
                window.pageRSSHub[tabId] = feeds || [];
                setBadge(tabId);
            });
        });
    }
}

export function removeRSS (tabId) {
    delete window.pageRSS[tabId];
    delete window.websiteRSSHub[tabId];
    delete window.pageRSSHub[tabId];
}