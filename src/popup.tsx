import { useState } from "react"
import "./style.css"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div className="min-w-[350px] p-5">
      <a className="absolute right-4" href="/options.html" target="_blank">
        <i className="icon-[mingcute--settings-3-fill] w-5 h-5 text-slate-600 hover:text-black transition-colors"></i>
      </a>
      <div className="space-y-4">
          <h2 className="text-base font-bold">( ´･･)ﾉ(._.`) <span>{chrome.i18n.getMessage("RSSNotFound")}</span></h2>
          <p dangerouslySetInnerHTML={{
            __html: chrome.i18n.getMessage("joinRSSHub")
          }}></p>
      </div>
      <div className="space-y-4 hidden">
          <h2 className="text-base font-bold">{chrome.i18n.getMessage("currentPageRSS")}</h2>
          <ul></ul>
      </div>
      <div className="space-y-4 hidden">
          <h2 className="text-base font-bold">{chrome.i18n.getMessage("currentPageRSSHub")}</h2>
          <ul></ul>
      </div>
      <div className="space-y-4 hidden">
          <h2 className="text-base font-bold">{chrome.i18n.getMessage("currentSiteRSSHub")}</h2>
          <ul></ul>
      </div>
    </div>
  )
}

export default IndexPopup
