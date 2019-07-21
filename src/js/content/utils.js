let pageRSS = null;

function handleUrl (url) {
    if (url.startsWith('//')) {
        url = document.location.protocol + url;
    } else if (url.startsWith('/')) {
        url = document.location.origin + url;
    } else if (!(/^(http|https):\/\//i.test(url))) {
        url = document.location.href + '/' + url.replace(/^\//g, '');
    }
    return url;
}

export function getPageRSS () {
    if (!pageRSS) {
        pageRSS = [];
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
        for (let i = 0; i < links.length; i++) {
            if (links[i].hasAttribute('type') && types.indexOf(links[i].getAttribute('type')) !== -1) {
                let feed_url = links[i].getAttribute('href');

                if (feed_url) {
                    let feed = {
                        url: handleUrl(feed_url),
                        title: links[i].getAttribute('title') || document.querySelector('title') && document.querySelector('title').innerHTML,
                        image: document.querySelector('link[rel="icon"]') && handleUrl(document.querySelector('link[rel="icon"]').getAttribute('href')) || document.location.origin + '/favicon.ico',
                    };
                    pageRSS.push(feed);
                }
            }
        }
    }
    return pageRSS;
}