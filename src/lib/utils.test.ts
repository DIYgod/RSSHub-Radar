import { describe, expect, it } from "vitest"

import { isLikelyFeedUrl, isSameDocumentUrl } from "./utils"

describe("isLikelyFeedUrl", () => {
  it.each([
    "https://example.com/feed",
    "https://example.com/feed/",
    "https://example.com/blog/rss.xml",
    "https://example.com/atom.xml",
    "https://example.com/index.rss",
    "https://example.com/feeds/posts/default",
    "https://example.com/?feed=rss2",
    "https://example.com/news?format=atom",
  ])("matches %s", (url) => {
    expect(isLikelyFeedUrl(url)).toBe(true)
  })

  it.each([
    "https://sep.ucas.ac.cn/",
    "https://example.com/login",
    "https://example.com/login?redirect=/feed",
    "https://example.com/account/sign-in?next=%2Fhome",
    "https://example.com/rssreader-review",
    "ftp://example.com/feed.xml",
    "not a url",
  ])("does not match %s", (url) => {
    expect(isLikelyFeedUrl(url)).toBe(false)
  })
})

describe("isSameDocumentUrl", () => {
  it("ignores the hash and the protocol", () => {
    expect(
      isSameDocumentUrl(
        "https://example.com/login?next=1#",
        "http://example.com/login?next=1",
      ),
    ).toBe(true)
  })

  it("distinguishes other paths and queries", () => {
    expect(
      isSameDocumentUrl(
        "https://example.com/feed",
        "https://example.com/login",
      ),
    ).toBe(false)
    expect(
      isSameDocumentUrl(
        "https://example.com/login?a=1",
        "https://example.com/login?a=2",
      ),
    ).toBe(false)
  })
})
