import psl from 'psl';
import RouteRecognizer from 'route-recognizer';

function ruleHandler(rule, params, url, html, success, fail) {
    const run = () => {
        let reaultWithParams;
        if (typeof rule.target === 'function') {
            const parser = new DOMParser();
            const document = parser.parseFromString(html, 'text/html');
            try {
                reaultWithParams = rule.target(params, url, document);
            } catch (error) {
                console.warn(error);
                reaultWithParams = '';
            }
        } else if (typeof rule.target === 'string') {
            reaultWithParams = rule.target;
        }

        if (reaultWithParams) {
            for (const param in params) {
                reaultWithParams = reaultWithParams.replace(`/:${param}`, `/${params[param]}`);
            }
        }

        return reaultWithParams;
    };
    const reaultWithParams = run();
    if (reaultWithParams && (!rule.verification || rule.verification(params))) {
        success(reaultWithParams);
    } else {
        fail();
    }
}

function formatBlank(str1, str2) {
    if (str1 && str2) {
        return str1 + (str1[str1.length - 1].match(/[a-zA-Z0-9]/) || str2[0].match(/[a-zA-Z0-9]/) ? ' ' : '') + str2;
    } else {
        return (str1 || '') + (str2 || '');
    }
}

function parseRules(rules) {
    return typeof rules === 'string' ? window['lave'.split('').reverse().join('')](rules) : rules;
}

export function getPageRSSHub(data) {
    const { url, html } = data;
    const rules = parseRules(data.rules);

    const parsedDomain = psl.parse(new URL(url).hostname);
    if (parsedDomain && parsedDomain.domain) {
        const subdomain = parsedDomain.subdomain;
        const domain = parsedDomain.domain;
        if (rules[domain]) {
            let rule = rules[domain][subdomain || '.'];
            if (!rule) {
                if (subdomain === 'www') {
                    rule = rules[domain]['.'];
                } else if (!subdomain) {
                    rule = rules[domain].www;
                }
            }
            if (rule) {
                const recognized = [];
                rule.forEach((ru, index) => {
                    if (ru.source !== undefined) {
                        if (Object.prototype.toString.call(ru.source) === '[object Array]') {
                            ru.source.forEach((source) => {
                                const router = new RouteRecognizer();
                                router.add([
                                    {
                                        path: source,
                                        handler: index,
                                    },
                                ]);
                                const result = router.recognize(new URL(url).pathname.replace(/\/$/, ''));
                                if (result && result[0]) {
                                    recognized.push(result[0]);
                                }
                            });
                        } else if (typeof ru.source === 'string') {
                            const router = new RouteRecognizer();
                            router.add([
                                {
                                    path: ru.source,
                                    handler: index,
                                },
                            ]);
                            const result = router.recognize(new URL(url).pathname.replace(/\/$/, ''));
                            if (result && result[0]) {
                                recognized.push(result[0]);
                            }
                        }
                    }
                });
                const result = [];
                Promise.all(
                    recognized.map(
                        (recog) =>
                            new Promise((resolve) => {
                                ruleHandler(
                                    rule[recog.handler],
                                    recog.params,
                                    url,
                                    html,
                                    (parsed) => {
                                        if (parsed) {
                                            result.push({
                                                title: formatBlank(rules[domain]._name ? '当前' : '', rule[recog.handler].title),
                                                url: '{rsshubDomain}' + parsed,
                                                path: parsed,
                                            });
                                        } else {
                                            result.push({
                                                title: formatBlank(rules[domain]._name ? '当前' : '', rule[recog.handler].title),
                                                url: rule[recog.handler].docs,
                                                isDocs: true,
                                            });
                                        }
                                        resolve();
                                    },
                                    () => {
                                        resolve();
                                    }
                                );
                            })
                    )
                );
                return result;
            } else {
                return [];
            }
        } else {
            return [];
        }
    } else {
        return [];
    }
}

export function getWebsiteRSSHub(data) {
    const { url } = data;
    const rules = parseRules(data.rules);
    const parsedDomain = psl.parse(new URL(url).hostname);
    if (parsedDomain && parsedDomain.domain) {
        const domain = parsedDomain.domain;
        if (rules[domain]) {
            const domainRules = [];
            for (const subdomainRules in rules[domain]) {
                if (subdomainRules[0] !== '_') {
                    domainRules.push(...rules[domain][subdomainRules]);
                }
            }
            return domainRules.map((rule) => ({
                title: formatBlank(rules[domain]._name, rule.title),
                url: rule.docs,
                isDocs: true,
            }));
        } else {
            return [];
        }
    } else {
        return [];
    }
}

export function getList(data) {
    const rules = parseRules(data.rules);
    for (const rule in rules) {
        for (const subrule in rules[rule]) {
            if (subrule[0] !== '_') {
                rules[rule][subrule].forEach((item) => {
                    delete item.source;
                    delete item.target;
                    delete item.script;
                    delete item.verification;
                });
            }
        }
    }
    return rules;
}
