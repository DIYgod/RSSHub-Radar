import { useEffect, useState } from "react"

import { Button } from "~/lib/components/Button"
import { defaultConfig, getConfig } from "~/lib/config"
import type { RSSData } from "~/lib/types"
import RSSHubIcon from "data-base64:~/assets/icon.png"
import { useCopyToClipboard } from 'usehooks-ts'

function RSSItem({ item }: { item: RSSData }) {
  const [config, setConfig] = useState(defaultConfig)
  getConfig().then(setConfig)
  const [_, copy] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 1000)
    }
  }, [copied])

  return (
    <li className="flex mb-4 items-center space-x-2 w-max min-w-full">
      <img className="w-8 h-8" src={item.image || RSSHubIcon} />
      <a
        target="_blank"
        href={item.url}
        className="w-48 cursor-pointer flex flex-col justify-between text-black flex-1">
        <span className="text-[13px] truncate">{item.title}</span>
        <span className="text-xs truncate text-zinc-400">
          {item.url.replace("https://", "").replace("http://", "")}
        </span>
      </a>
      {item.isDocs && (
        <Button variant="rss" size="sm">
          <a target="_blank" href={item.url}>
            {chrome.i18n.getMessage("document")}
          </a>
        </Button>
      )}
      {!item.isDocs && (
        <Button variant="rss" size="sm" className="w-[60px]" onClick={() => {
          copy(item.url)
          setCopied(true)
        }}>
          {chrome.i18n.getMessage(copied ? "copied" : "copy")}
        </Button>
      )}
      {!item.isDocs && config.submitto.checkchan && config.submitto.checkchanBase ? (
        <Button variant="rss" size="sm" className="border-[#f28f34] text-[#f28f34] hover:bg-[#f28f34]">
          <a
            target="_blank"
            href={`${config.submitto.checkchanBase.replace(
              /\/$/,
              ""
            )}/index.html#/check/add?title=${encodeURI(
              item.title
            )}&url=${encodeURI(item.url)}&type=rss&icon=${encodeURI(
              item.image
            )}`}
          >
            {chrome.i18n.getMessage("subscribe to")} CheckChan
          </a>
        </Button>
      ) : (
        ""
      )}
      {!item.isDocs && config.submitto.ttrss && config.submitto.ttrssDomain ? (
        <Button variant="rss" size="sm" className="border-[#f28f34] text-[#f28f34] hover:bg-[#f28f34]">
          <a
            target="_blank"
            href={`{config.submitto.ttrssDomain.replace(/\/$/, '')}/public.php?op=bookmarklets--subscribe&feed_url=${encodeURI(
              item.url
            )}`}
          >
            {chrome.i18n.getMessage("subscribe to")} TTRSS
          </a>
        </Button>
      ) : (
        ""
      )}
      {!item.isDocs && config.submitto.miniflux && config.submitto.minifluxDomain ? (
        <Button variant="rss" size="sm" className="border-[#33995b] text-[#33995b] hover:bg-[#33995b]">
          <a
            target="_blank"
            href={`${config.submitto.minifluxDomain.replace(
              /\/$/,
              ""
            )}/bookmarklet?uri=${encodeURI(item.url)}`}
          >
            {chrome.i18n.getMessage("subscribe to")} Miniflux
          </a>
        </Button>
      ) : (
        ""
      )}
      {!item.isDocs && config.submitto.freshrss && config.submitto.freshrssDomain ? (
        <Button variant="rss" size="sm" className="border-[#0062db] text-[#0062db] hover:bg-[#0062db]">
          <a
            target="_blank"
            href={`${config.submitto.freshrssDomain.replace(
              /\/$/,
              ""
            )}/i/?c=feed&a=add&url_rss=${encodeURI(item.url)}`}
          >
            {chrome.i18n.getMessage("subscribe to")} FreshRSS
          </a>
        </Button>
      ) : (
        ""
      )}
      {!item.isDocs && config.submitto.nextcloudnews && config.submitto.nextcloudnewsDomain ? (
        <Button variant="rss" size="sm" className="border-[#0082c9] text-[#0082c9] hover:bg-[#0082c9]">
          <a
            target="_blank"
            href={`${config.submitto.nextcloudnewsDomain.replace(
              /\/$/,
              ""
            )}/?subscribe_to=${encodeURI(item.url)}`}
          >
            {chrome.i18n.getMessage("subscribe to")} Nextcloud News
          </a>
        </Button>
      ) : (
        ""
      )}
      {!item.isDocs && config.submitto.feedly ? (
        <Button variant="rss" size="sm" className="border-[#2bb24c] text-[#2bb24c] hover:bg-[#2bb24c]">
          <a
            target="_blank"
            href={`https://feedly.com/i/subscription/feed/${encodeURI(
              item.url
            )}`}
            className="rss-action rss-submitto-feedly">
            {chrome.i18n.getMessage("subscribe to")} Feedly
          </a>
        </Button>
      ) : (
        ""
      )}
      {!item.isDocs && config.submitto.inoreader && config.submitto.inoreaderDomain ? (
        <Button variant="rss" size="sm" className="border-[#0099eb] text-[#0099eb] hover:bg-[#0099eb]">
          <a
            target="_blank"
            href={`${config.submitto.inoreaderDomain.replace(
              /\/$/,
              ""
            )}/?add_feed=${encodeURI(item.url)}`}
          >
            {chrome.i18n.getMessage("subscribe to")} Inoreader
          </a>
        </Button>
      ) : (
        ""
      )}
      {!item.isDocs && config.submitto.feedbin && config.submitto.feedbinDomain ? (
        <Button variant="rss" size="sm" className="border-[#0867e2] text-[#0867e2] hover:bg-[#0867e2]">
          <a
            target="_blank"
            href={`${config.submitto.feedbinDomain.replace(
              /\/$/,
              ""
            )}/?subscribe=${encodeURI(item.url)}`}
          >
            {chrome.i18n.getMessage("subscribe to")} Feedbin
          </a>
        </Button>
      ) : (
        ""
      )}
      {!item.isDocs && config.submitto.theoldreader ? (
        <Button variant="rss" size="sm" className="border-[#ff2300] text-[#ff2300] hover:bg-[#ff2300]">
          <a
            target="_blank"
            href={`https://theoldreader.com/feeds/subscribe?url=${encodeURI(
              item.url
            )}`}
          >
            {chrome.i18n.getMessage("subscribe to")} The Old Reader
          </a>
        </Button>
      ) : (
        ""
      )}
      {!item.isDocs && config.submitto.feedspub ? (
        <Button variant="rss" size="sm" className="border-[#61af4b] text-[#61af4b] hover:bg-[#61af4b]">
          <a
            target="_blank"
            href={`https://feeds.pub/feed/${encodeURIComponent(item.url)}`}
          >
            {chrome.i18n.getMessage("subscribe to")} Feeds.Pub
          </a>
        </Button>
      ) : (
        ""
      )}
      {!item.isDocs && config.submitto.bazqux ? (
        <Button variant="rss" size="sm" className="border-[#00af00] text-[#00af00] hover:bg-[#00af00]">
          <a
            target="_blank"
            href={`https://bazqux.com/add?url=${encodeURIComponent(item.url)}`}
          >
            {chrome.i18n.getMessage("subscribe to")} BazQux Reader
          </a>
        </Button>
      ) : (
        ""
      )}
      {!item.isDocs && config.submitto.local ? (
        <Button variant="rss" size="sm">
          <a
            target="_blank"
            href={`feed://${item.url}`}
            className="rss-action rss-submitto-local">
            {chrome.i18n.getMessage("subscribe to local reader")}
          </a>
        </Button>
      ) : (
        ""
      )}
    </li>
  )
}

export default RSSItem
