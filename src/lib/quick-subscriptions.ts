export const quickSubscriptions: ({
  name: string
  projectUrl?: string
  key: string
  themeColor: string
  getSubscribePath: (data: {
    url: string
    encodedUrl: string
    title: string
    image: string
  }) => string
} & ({
  subscribeDomainKey: string
} | {
  subscribeDomain: string
}))[] = [{
  name: "Miniflux",
  projectUrl: "https://miniflux.app",
  key: "miniflux",
  subscribeDomainKey: "minifluxDomain",
  themeColor: "#33995b",
  getSubscribePath: (data) => `/bookmarklet?uri=${data.encodedUrl}`
}, {
  name: "Inoreader",
  projectUrl: "https://www.inoreader.com/",
  key: "inoreader",
  subscribeDomainKey: "inoreaderDomain",
  themeColor: "#0099eb",
  getSubscribePath: (data) => `/?add_feed=${data.encodedUrl}`
}, {
  name: "Feedly",
  projectUrl: "https://feedly.com",
  key: "feedly",
  subscribeDomain: "https://feedly.com",
  themeColor: "#2bb24c",
  getSubscribePath: (data) => `/i/subscription/feed/${data.encodedUrl}`
}, {
  name: "FreshRSS",
  projectUrl: "https://freshrss.org",
  key: "freshrss",
  subscribeDomainKey: "freshrssDomain",
  themeColor: "#0062db",
  getSubscribePath: (data) => `/i/?c=feed&a=add&url_rss=${data.encodedUrl}`
}, {
  name: "Tiny Tiny RSS",
  projectUrl: "https://tt-rss.org/",
  key: "ttrss",
  subscribeDomainKey: "ttrssDomain",
  themeColor: "#f28f34",
  getSubscribePath: (data) => `/public.php?op=bookmarklets--subscribe&feed_url=${data.encodedUrl}`
}, {
  name: "Nextcloud News",
  projectUrl: "https://apps.nextcloud.com/apps/news",
  key: "nextcloudnews",
  subscribeDomainKey: "nextcloudnewsDomain",
  themeColor: "#0082c9",
  getSubscribePath: (data) => `/?subscribe_to=${data.encodedUrl}`
}, {
  name: "Feedbin",
  projectUrl: "https://feedbin.com/",
  key: "feedbin",
  subscribeDomainKey: "feedbinDomain",
  themeColor: "#0867e2",
  getSubscribePath: (data) => `/?subscribe=${data.encodedUrl}`
}, {
  name: "The Old Reader",
  projectUrl: "https://theoldreader.com/",
  key: "theoldreader",
  subscribeDomain: "https://theoldreader.com",
  themeColor: "#ff2300",
  getSubscribePath: (data) => `/feeds/subscribe?url=${data.encodedUrl}`
}, {
  name: "Feeds.Pub",
  projectUrl: "https://feeds.pub/",
  key: "feedspub",
  subscribeDomain: "https://feeds.pub",
  themeColor: "#61af4b",
  getSubscribePath: (data) => `/feed/${data.encodedUrl}`
}, {
  name: "BazQux Reader",
  projectUrl: "https://bazqux.com/",
  key: "bazqux",
  subscribeDomain: "https://bazqux.com",
  themeColor: "#00af00",
  getSubscribePath: (data) => `/add?url=${data.encodedUrl}`
}, {
  name: "CheckChan",
  projectUrl: "https://ckc.ftqq.com",
  key: "checkchan",
  subscribeDomainKey: "checkchanBase",
  themeColor: "#f28f34",
  getSubscribePath: (data) => `/index.html#/check/add?title=${encodeURIComponent(data.title)}&url=${data.encodedUrl}&type=rss&icon=${encodeURIComponent(data.image)}`
}, {
  name: "localReader",
  key: "local",
  subscribeDomain: "feed://",
  themeColor: "#f28f34",
  getSubscribePath: (data) => data.url.replace(/^https?:\/\//, "")
}]