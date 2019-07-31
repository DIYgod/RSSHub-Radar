export const defaultConfig = {
    rsshubDomain: 'https://rsshub.app',
    notice: {
        badge: true,
    },
    submitto: {
        ttrss: false,
        ttrssDomain: '',
        feedly: true,
        inoreader: false,
    },
    refreshTimeout: 5 * 60 * 60,
};

export function getConfig (success) {
    if (chrome.storage) {
        chrome.storage.sync.get('config', (result) => {
            success(Object.assign({}, defaultConfig, result.config));
        });
    } else {
        success && success(defaultConfig);
    }
}

export function saveConfig (config, success) {
    if (!config.rsshubDomain) {
        config.rsshubDomain = defaultConfig.rsshubDomain;
    }
    config.rsshubDomain = config.rsshubDomain.replace(/\/$/, '');
    if (chrome.storage) {
        chrome.storage.sync.set({
            config,
        }, () => {
            success && success();
        });
    }
}