import { describe, expect, it } from "vitest"

import { quickSubscriptions } from "./quick-subscriptions"

const wyrmrss = quickSubscriptions.find(({ key }) => key === "wyrmrss")!

describe("WyrmRSS quick subscription", () => {
  it.each([
    ["https://example.com/feed.xml", "Example"],
    [
      "https://rsshub.example.com/github/issue/DIYgod/RSSHub?label=help+wanted&lang=pt#recent",
      "Notícias & updates + 100% #1 / <feed>",
    ],
    ["https://example.com/feed?literal=%2F&name=a%26b", ""],
  ])("preserves feed URL %s and its title", (url, title) => {
    const path = wyrmrss.getSubscribePath({
      url,
      encodedUrl: encodeURIComponent(url),
      title,
      image: "",
    })
    const target = new URL(path, "https://wyrm.example.com")

    expect(target.origin).toBe("https://wyrm.example.com")
    expect(target.pathname).toBe("/subscribe")
    expect(target.searchParams.get("url")).toBe(url)
    expect(target.searchParams.get("title")).toBe(title)
    expect([...target.searchParams.keys()]).toEqual(["url", "title"])
    expect(target.hash).toBe("")
  })
})
