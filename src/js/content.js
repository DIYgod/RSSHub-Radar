function getPageRSS () {
    let types = [
        'application/rss+xml',
        'application/atom+xml',
        'application/rdf+xml',
        'application/rss',
        'application/atom',
        'application/rdf',
        'text/rss+xml',
        'text/atom+xml',
        'text/rdf+xml',
        'text/rss',
        'text/atom',
        'text/rdf'
    ];
    let links = document.querySelectorAll('link[type]');
    let feeds = [];
    for (let i = 0; i < links.length; i++) {
        if (links[i].hasAttribute('type') && types.indexOf(links[i].getAttribute('type')) !== -1) {
            let feed_url = links[i].getAttribute('href');

            if (feed_url.startsWith('//')) {
                feed_url = document.location.protocol + feed_url;
            } else if (feed_url.startsWith('/')) {
                feed_url = document.location.origin + feed_url;
            } else if (!(/^(http|https):\/\//i.test(feed_url))) {
                feed_url = document.location.href + '/' + feed_url.replace(/^\//g, '');                    
            }

            let feed = {
                url: feed_url,
                title: links[i].getAttribute('title') || feed_url
            };
            feeds.push(feed);
        }
    }
    return feeds;
}

chrome.runtime.sendMessage(null, {
    text: 'setPageRSS',
    feeds: getPageRSS(),
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.text === 'getPageRSS') {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            sendResponse(getPageRSS());
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                sendResponse(getPageRSS());
            });
        }
    }
});