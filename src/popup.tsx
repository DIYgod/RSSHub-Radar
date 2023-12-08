import { useState } from "react"
import "./style.css"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div className="min-w-[350px]">
      <div className="icons">
          <a className="icons-item icons-about" href="/options.html#/about"></a>
          <a className="icons-item icons-setting" href="/options.html#/setting"></a>
      </div>
      <div className="no-rss">
          <h2>( ´･･)ﾉ(._.`) <span data-i18n>rss not found</span></h2>
          <p data-i18n>join rsshub</p>
      </div>
      <div className="page-rss">
          <h2 data-i18n>current page rss</h2>
          <ul></ul>
      </div>
      <div className="page-rsshub">
          <h2 data-i18n>current page RSSHub</h2>
          <ul></ul>
      </div>
      <div className="website-rsshub">
          <h2 data-i18n>current site RSSHub</h2>
          <ul></ul>
      </div>
    </div>
  )
}

export default IndexPopup
