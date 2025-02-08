import RSSHubIcon from "data-base64:~/assets/icon.png"
import MD5 from "md5.js"
import { useEffect, useState } from "react"
import { useCopyToClipboard } from "usehooks-ts"

import { Button } from "~/lib/components/Button"
import { defaultConfig, getConfig } from "~/lib/config"
import { quickSubscriptions } from "~/lib/quick-subscriptions"
import report from "~/lib/report"
import type { RSSData } from "~/lib/types"
import { logoMap } from "~/lib/quick-subscriptions-logos"

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
  useEffect(() => {
    getConfig().then(setConfig)
  }, [])
  const [_, copy] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 1000)
    }
  }, [copied])

  let url = item.url.replace(
    "{rsshubDomain}",
    config.rsshubDomain.replace(/\/$/, ""),
  ).replace(/\/$/, "")

  if (type === "currentPageRSSHub" && config.rsshubAccessControl.accessKey) {
    const urlObj = new URL(url)

    if (config.rsshubAccessControl.accessKeyType === "key") {
      urlObj.searchParams.append('key', config.rsshubAccessControl.accessKey)
    } else {
      const md5 = new MD5().update(urlObj.pathname + config.rsshubAccessControl.accessKey).digest("hex")
      urlObj.searchParams.append('code', md5)
    }

    url = urlObj.toString()
  }
  if (type === "currentPageRSSHub") {
    item.title = item.title.replace(
      /^Current/,
      chrome.i18n.getMessage("current"),
    )
  }
  const encodedUrl = encodeURIComponent(url)

  return (
    <li className="flex mb-4 items-center w-max min-w-full">
      <img className="w-8 h-8" src={item.image || RSSHubIcon} />
      <a
        target="_blank"
        href={url}
        className="w-48 cursor-pointer flex flex-col justify-between text-black dark:text-white flex-1 mx-2"
      >
        <span className="text-[13px] truncate">{item.title}</span>
        <span className="text-xs truncate text-zinc-400">
          {url.replace("https://", "").replace("http://", "")}
        </span>
      </a>
      {quickSubscriptions.map((quickSubscription) => {
        if (
          item.isDocs ||
          !config.submitto[quickSubscription.key] ||
          ("subscribeDomainKey" in quickSubscription &&
            !config.submitto[quickSubscription.subscribeDomainKey])
        ) {
          return null
        }
        let subscriptionDomain
        if ("subscribeDomainKey" in quickSubscription) {
          subscriptionDomain =
            config.submitto[quickSubscription.subscribeDomainKey]
        } else {
          subscriptionDomain = quickSubscription.subscribeDomain
        }
        subscriptionDomain = subscriptionDomain.replace(/(?<!\/)\/$/, "")

        return (
          <Button
            variant="ghost"
            size="sm"
            style={{
              color: quickSubscription.themeColor,
            }}
            onClickCapture={() => {
              report({
                name: `popup-subscribe-${quickSubscription.key}`,
              })
            }}
            key={quickSubscription.key}
          >
            <a
              target="_blank"
              href={`${subscriptionDomain}${quickSubscription.getSubscribePath({
                url,
                encodedUrl,
                title: item.title,
                image: item.image,
              })}`}
            >
              {logoMap.get(quickSubscription.key) ?
                <img className="w-5 h-5 rounded" src={logoMap.get(quickSubscription.key)} /> : (chrome.i18n.getMessage(quickSubscription.name) ||
                quickSubscription.name)
              }
            </a>
          </Button>
        )
      })}
      {item.isDocs && (
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary text-lg"
          onClickCapture={() => {
            report({
              name: "popup-docs",
            })
          }}
        >
          <a target="_blank" href={url} className="flex center">
            <i className="i-mingcute-list-search-line"></i>
          </a>
        </Button>
      )}
      {!item.isDocs && (
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary text-lg"
          onClick={() => {
            copy(url)
            setCopied(true)
            report({
              name: "popup-copy",
            })
          }}
        >
          <i className={copied ? "i-mingcute-check-line" : "i-mingcute-copy-2-line"}></i>
        </Button>
      )}
      {!item.isDocs && !hidePreview && (
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary text-lg"
        >
          <a target="_blank" href={`/tabs/preview.html?url=${encodedUrl}`} className="flex center">
            <i className="i-mingcute-eye-line"></i>
          </a>
        </Button>
      )}
    </li>
  )
}

export default RSSItem
