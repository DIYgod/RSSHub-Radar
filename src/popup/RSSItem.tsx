import { useState } from "react"

import { defaultConfig, getConfig } from "~/utils/config"
import type { RSSData } from "~/utils/types"
import { Button } from "~/utils/components/Button"

function RSSItem({ item }: { item: RSSData }) {
  const [config, setConfig] = useState(defaultConfig)
  getConfig().then(setConfig)

  return (
    <li className="flex mb-4 items-center space-x-2">
      <img className="w-8 h-8" src={item.image || "./rsshub.png"} />
      <a href={item.url} className="w-48 cursor-pointer flex flex-col justify-between text-black">
        <span className="text-[13px] truncate">{item.title}</span>
        <span className="text-xs truncate text-zinc-400">
          {item.url.replace("https://", "").replace("http://", "")}
        </span>
      </a>
      {item.isDocs ? (
        <a href={item.url} className="rss-action">
          {chrome.i18n.getMessage("documentation")}
        </a>
      ) : (
        <Button data-clipboard-text={item.url}>
          {chrome.i18n.getMessage("copy")}
        </Button>
      )}
      {config.submitto.checkchan && config.submitto.checkchanBase ? (
        <a
          href={`${config.submitto.checkchanBase.replace(/\/$/, '')}/index.html#/check/add?title=${encodeURI(item.title)}&url=${encodeURI(item.url)}&type=rss&icon=${encodeURI(
            item.image
          )}`}
          className="rss-action rss-submitto-checkchan">
          {chrome.i18n.getMessage("subscribe to")} CheckChan
        </a>
      ) : (
        ""
      )}
      {config.submitto.ttrss && config.submitto.ttrssDomain ? (
        <a
          href={`{config.submitto.ttrssDomain.replace(/\/$/, '')}/public.php?op=bookmarklets--subscribe&feed_url=${encodeURI(item.url)}`}
          className="rss-action rss-submitto-ttrss">
          {chrome.i18n.getMessage("subscribe to")} TTRSS
        </a>
      ) : (
        ""
      )}
      {config.submitto.miniflux && config.submitto.minifluxDomain ? (
        <a
          href={`${config.submitto.minifluxDomain.replace(/\/$/, '')}/bookmarklet?uri=${encodeURI(item.url)}`}
          className="rss-action rss-submitto-miniflux">
          {chrome.i18n.getMessage("subscribe to")} Miniflux
        </a>
      ) : (
        ""
      )}
      {config.submitto.freshrss && config.submitto.freshrssDomain ? (
        <a
          href={`${config.submitto.freshrssDomain.replace(/\/$/, '')}/i/?c=feed&a=add&url_rss=${encodeURI(item.url)}`}
          className="rss-action rss-submitto-freshrss">
          {chrome.i18n.getMessage("subscribe to")} FreshRSS
        </a>
      ) : (
        ""
      )}
      {config.submitto.nextcloudnews && config.submitto.nextcloudnewsDomain ? (
        <a
          href={`${config.submitto.nextcloudnewsDomain.replace(/\/$/, '')}/?subscribe_to=${encodeURI(item.url)}`}
          className="rss-action rss-submitto-nextcloudnews">
          {chrome.i18n.getMessage("subscribe to")} Nextcloud News
        </a>
      ) : (
        ""
      )}
      {config.submitto.feedly
        ? <a href={`https://feedly.com/i/subscription/feed/${encodeURI(
            item.url
          )}`} className="rss-action rss-submitto-feedly">{chrome.i18n.getMessage(
            "subscribe to"
          )} Feedly</a>
        : ""}
      {config.submitto.inoreader && config.submitto.inoreaderDomain ? (
        <a
          href={`${config.submitto.inoreaderDomain.replace(/\/$/, '')}/?add_feed=${encodeURI(item.url)}`}
          className="rss-action rss-submitto-inoreader">
          {chrome.i18n.getMessage("subscribe to")} Inoreader
        </a>
      ) : (
        ""
      )}
      {config.submitto.feedbin && config.submitto.feedbinDomain ? (
        <a
          href={`${config.submitto.feedbinDomain.replace(/\/$/, '')}/?subscribe=${encodeURI(item.url)}`}
          className="rss-action rss-submitto-feedbin">
          {chrome.i18n.getMessage("subscribe to")} Feedbin
        </a>
      ) : (
        ""
      )}
      {config.submitto.theoldreader ? (
        <a
          href={`https://theoldreader.com/feeds/subscribe?url=${encodeURI(item.url)}`}
          className="rss-action rss-submitto-theoldreader">
          {chrome.i18n.getMessage("subscribe to")} The Old Reader
        </a>
      ) : (
        ""
      )}
      {config.submitto.feedspub ? (
        <a
          href={`https://feeds.pub/feed/${encodeURIComponent(item.url)}`}
          className="rss-action rss-submitto-feedspub">
          {chrome.i18n.getMessage("subscribe to")} Feeds.Pub
        </a>
      ) : (
        ""
      )}
      {config.submitto.bazqux ? (
        <a
          href={`https://bazqux.com/add?url=${encodeURIComponent(item.url)}`}
          className="rss-action rss-submitto-bazqux">
          {chrome.i18n.getMessage("subscribe to")} BazQux Reader
        </a>
      ) : (
        ""
      )}
      {config.submitto.local ? (
        <a href={`feed://${item.url}`} className="rss-action rss-submitto-local">
          {chrome.i18n.getMessage("subscribe to local reader")}
        </a>
      ) : (
        ""
      )}
    </li>
  )
}

export default RSSItem
