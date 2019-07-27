export const defaultConfig = {
    rsshubDomain: 'https://rsshub.app',
    notice: {
        badge: true,
    },
    submitto: {
        ttrss: false,
        ttrssDomain: '',
        feedly: false,
        inoreader: false,
    }
};

export function getConfig (success) {
    chrome.storage.local.get('config', (result) => {
        success(Object.assign({}, defaultConfig, result.config));
    });
}

export function saveConfig (config, success) {
    config.rsshubDomain = config.rsshubDomain.replace(/\/$/, '');
    chrome.storage.local.set({
        config,
    }, () => {
        success();
    });
}