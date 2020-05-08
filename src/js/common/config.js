export const defaultConfig = {
    rsshubDomain: 'https://rsshub.app',
    notice: {
        badge: true,
    },
    submitto: {
        ttrss: false,
        ttrssDomain: '',
        miniflux: false,
        minifluxDomain: '',
        freshrss: false,
        freshrssDomain: '',
        feedly: true,
        inoreader: false,
        feedbin: false,
        theoldreader: false,
        local: false,
    },
    refreshTimeout: 5 * 60 * 60,
};

export function getConfig(success) {
    if (chrome.storage) {
        chrome.storage.sync.get('config', (result) => {
            success(Object.assign({}, defaultConfig, result.config));
        });
    } else {
        success && success(defaultConfig);
    }
}

export function saveConfig(config, success) {
    if (!config.rsshubDomain) {
        config.rsshubDomain = defaultConfig.rsshubDomain;
    }
    config.rsshubDomain = config.rsshubDomain.replace(/\/$/, '');
    if (chrome.storage) {
        chrome.storage.sync.set(
            {
                config,
            },
            () => {
                success && success();
            }
        );
    }
}
