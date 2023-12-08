import { useState } from "react"

import "./style.css"

function IndexNewtab() {
  const [data, setData] = useState("")

  return (
    <div
      className="new-tab"
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column"
      }}>
      <h1>
        Welcome to your <a href="https://www.plasmo.com">Plasmo</a> Extension!
      </h1>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <footer>Crafted by @PlamoHQ</footer>
    </div>
  )
}

export default IndexNewtab
