import { useEffect, useState } from "react"
import "~/lib/style.css"
import { sendToBackground } from "@plasmohq/messaging"
import RSSList from "./RSSList"

function IndexPopup() {
  const [data, setData] = useState({
    pageRSS: [],
    pageRSSHub: [],
    websiteRSSHub: [],
  })
  useEffect(() => {
    sendToBackground({
      name: "popupReady",
    }).then((res) => {
      setData(Object.assign({
        pageRSS: [],
        pageRSSHub: [],
        websiteRSSHub: [],
      }, res))
    })
  }, [])

  return (
    <div className="min-w-[350px] p-5">
      <a className="absolute right-4 h-6 flex items-center" href="/options.html" target="_blank">
        <i className="i-mingcute-settings-3-line w-5 h-5 text-slate-600 hover:text-black transition-colors"></i>
      </a>
      {!data.pageRSS.length && !data.pageRSSHub.length && !data.websiteRSSHub.length && (
        <div className="space-y-4">
          <h2 className="text-base font-bold">( ´･･)ﾉ(._.`) <span>{chrome.i18n.getMessage("RSSNotFound")}</span></h2>
          <p dangerouslySetInnerHTML={{
            __html: chrome.i18n.getMessage("joinRSSHub")
          }}></p>
        </div>
      )}
      <RSSList type="currentPageRSS" list={data.pageRSS} />
      <RSSList type="currentPageRSSHub" list={data.pageRSSHub} />
      <RSSList type="currentSiteRSSHub" list={data.websiteRSSHub} />
    </div>
  )
}

export default IndexPopup
