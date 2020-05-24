import { getPageRSSHub, getWebsiteRSSHub, getList } from './utils';

window.getPageRSSHub = getPageRSSHub;
window.getWebsiteRSSHub = getWebsiteRSSHub;
window.getList = getList;

window.addEventListener('message', function (event) {
    const command = event.data.command;
    switch (command) {
        case 'getPageRSSHub':
            event.source.postMessage(
                {
                    origin: event.data,
                    result: getPageRSSHub(event.data.data),
                },
                event.origin
            );
            break;
        case 'getWebsiteRSSHub':
            event.source.postMessage(
                {
                    origin: event.data,
                    result: getWebsiteRSSHub(event.data.data),
                },
                event.origin
            );
            break;
        case 'getList':
            event.source.postMessage(
                {
                    origin: event.data,
                    result: getList(event.data.data),
                },
                event.origin
            );
            break;
    }
});
