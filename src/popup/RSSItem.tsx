import { useEffect, useState } from "react"

import { Button } from "~/lib/components/Button"
import { defaultConfig, getConfig } from "~/lib/config"
import type { RSSData } from "~/lib/types"
import RSSHubIcon from "data-base64:~/assets/icon.png"
import { useCopyToClipboard } from 'usehooks-ts'
import MD5 from 'md5.js';
import { quickSubscriptions } from "~/lib/quick-subscriptions"

function RSSItem({
  item,
  type,
  hidePreview,
}: {
  item: RSSData
  type: string
  hidePreview?: boolean
}) {
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

  let url = item.url.replace('{rsshubDomain}', config.rsshubDomain.replace(/\/$/, ''));
  if (type === 'currentPageRSSHub' && config.rsshubAccessControl.accessKey) {
    url = `${url}?code=${new MD5().update(item.path + config.rsshubAccessControl.accessKey).digest('hex')}`
  }
  url = encodeURI(url);
  const encodedUrl = encodeURIComponent(url);

  return (
    <li className="flex mb-4 items-center space-x-2 w-max min-w-full">
      <img className="w-8 h-8" src={item.image || RSSHubIcon} />
      <a
        target="_blank"
        href={url}
        className="w-48 cursor-pointer flex flex-col justify-between text-black flex-1">
        <span className="text-[13px] truncate">{item.title}</span>
        <span className="text-xs truncate text-zinc-400">
          {url.replace("https://", "").replace("http://", "")}
        </span>
      </a>
      {item.isDocs && (
        <Button variant="rss" size="sm">
          <a target="_blank" href={url}>
            {chrome.i18n.getMessage("document")}
          </a>
        </Button>
      )}
      {!item.isDocs && (
        <Button variant="rss" size="sm" className="w-[60px]" onClick={() => {
          copy(url)
          setCopied(true)
        }}>
          {chrome.i18n.getMessage(copied ? "copied" : "copy")}
        </Button>
      )}
      {!item.isDocs && !hidePreview && (
        <Button variant="rss" size="sm" className="border-[#0ea5e9] text-[#0ea5e9] hover:bg-[#0ea5e9]">
          <a
            target="_blank"
            href={`/tabs/preview.html?url=${encodedUrl}`}
          >
            {chrome.i18n.getMessage("preview")}
          </a>
        </Button>
      )}
      {quickSubscriptions.map((quickSubscription) => {
        if (item.isDocs
          || !config.submitto[quickSubscription.key]
          || ("subscribeDomainKey" in quickSubscription && !config.submitto[quickSubscription.subscribeDomainKey])
        ) {
          return null;
        }
        let subscriptionDomain
        if ("subscribeDomainKey" in quickSubscription) {
          subscriptionDomain = config.submitto[quickSubscription.subscribeDomainKey]
        } else {
          subscriptionDomain = quickSubscription.subscribeDomain
        }
        subscriptionDomain = subscriptionDomain.replace(/(?<!\/)\/$/, "")

        return (
          <Button variant="rss" size="sm" className={`border-[${quickSubscription.themeColor}] text-[${quickSubscription.themeColor}] hover:bg-[${quickSubscription.themeColor}]`}>
            <a
              target="_blank"
              href={`${subscriptionDomain}${quickSubscription.getSubscribePath({
                url,
                encodedUrl,
                title: item.title,
                image: item.image,
              })}`}
            >
              {chrome.i18n.getMessage(quickSubscription.name) || quickSubscription.name}
            </a>
          </Button>
        )
      })}
    </li>
  )
}

export default RSSItem
