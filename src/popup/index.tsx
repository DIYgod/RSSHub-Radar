import { useState } from "react"
import "~/utils/style.css"
import { sendToBackground } from "@plasmohq/messaging"
import RSSList from "./RSSList"

function IndexPopup() {
  const [data, setData] = useState({
    pageRSS: [],
    pageRSSHub: [],
    websiteRSSHub: [],
  })
  sendToBackground({
    name: "popupReady",
  }).then((res) => {
    console.log(res)
    setData(Object.assign({
      pageRSS: [],
      pageRSSHub: [],
      websiteRSSHub: [],
    }, res))
  })
  console.log("data", data)

  return (
    <div className="min-w-[350px] p-5">
      <a className="absolute right-4" href="/options.html" target="_blank">
        <i className="icon-[mingcute--settings-3-fill] w-5 h-5 text-slate-600 hover:text-black transition-colors"></i>
      </a>
      {!data.pageRSS && !data.pageRSSHub && !data.websiteRSSHub && (
        <div className="space-y-4">
          <h2 className="text-base font-bold">( ´･･)ﾉ(._.`) <span>{chrome.i18n.getMessage("RSSNotFound")}</span></h2>
          <p dangerouslySetInnerHTML={{
            __html: chrome.i18n.getMessage("joinRSSHub")
          }}></p>
        </div>
      )}
      <RSSList title="currentPageRSS" list={data.pageRSS} />
      <RSSList title="currentPageRSSHub" list={data.pageRSSHub} />
      <RSSList title="currentSiteRSSHub" list={data.websiteRSSHub} />
    </div>
  )
}

export default IndexPopup
