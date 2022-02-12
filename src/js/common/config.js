export const defaultConfig = {
    rsshubDomain: 'https://rsshub.app',
    rsshubAccessControl: {
        enabled: false,
        accessKey: '',
        useCode: false,
    },
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
        nextcloudnews: false,
        nextcloudnewsDomain: '',
        feedly: true,
        inoreader: false,
        feedbin: false,
        theoldreader: false,
        feedspub: false,
        bazqux: false,
        local: false,
    },
    refreshTimeout: 5 * 60 * 60,
    enableRemoteRules: !navigator.userAgent.match(/firefox|safari/i),
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
    if (config.rsshubDomain === defaultConfig.rsshubDomain) {
        config.rsshubAccessControl.enabled = defaultConfig.rsshubAccessControl.enabled;
    }
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
