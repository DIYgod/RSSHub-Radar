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
    }
};

export function getConfig (success) {
    if (chrome.storage) {
        chrome.storage.local.get('config', (result) => {
            success(Object.assign({}, defaultConfig, result.config));
        });
    } else {
        success(defaultConfig);
    }
}

export function saveConfig (config, success) {
    if (!config.rsshubDomain) {
        config.rsshubDomain = defaultConfig.rsshubDomain;
    }
    config.rsshubDomain = config.rsshubDomain.replace(/\/$/, '');
    if (chrome.storage) {
        chrome.storage.local.set({
            config,
        }, () => {
            success();
        });
    }
}