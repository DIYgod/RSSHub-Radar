// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { getPageRSS } from "./rss"

const FEED = `<?xml version="1.0"?><rss version="2.0"><channel><title>Example feed</title></channel></rss>`

const fetchSpy = vi.fn(async (_input: RequestInfo | URL) => new Response(FEED))

function requestedPaths() {
  return fetchSpy.mock.calls.map(([input]) => new URL(String(input)).pathname)
}

beforeEach(() => {
  history.replaceState(null, "", "/login")
  document.head.innerHTML = "<title>Sign in</title>"
  document.body.innerHTML = ""
  fetchSpy.mockClear()
  vi.stubGlobal("fetch", fetchSpy)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("getPageRSS", () => {
  it("never requests the current page through links that point back to it", async () => {
    document.body.innerHTML = `
      <form method="post"><input type="hidden" name="csrf" value="token"></form>
      <a href="#" class="rss-icon">RSS</a>
      <a href="" title="RSS">Subscribe</a>
      <a href="#comments">Feed</a>
    `

    const { pageRSS } = await getPageRSS()

    expect(requestedPaths()).not.toContain("/login")
    expect(pageRSS).toEqual([])
  })

  it("still checks links that look like feeds", async () => {
    document.body.innerHTML = `<a href="/feed">RSS</a>`

    const { pageRSS } = await getPageRSS()

    expect(requestedPaths()).toEqual(["/feed"])
    expect(pageRSS).toMatchObject([
      { url: `${location.origin}/feed`, title: "Example feed" },
    ])
  })

  it("detects feeds declared in the head without requesting them", async () => {
    document.head.innerHTML += `<link rel="alternate" type="application/rss+xml" title="Posts" href="/posts.xml">`

    const { pageRSS } = await getPageRSS()

    expect(fetchSpy).not.toHaveBeenCalled()
    expect(pageRSS).toMatchObject([
      { url: `${location.origin}/posts.xml`, title: "Posts" },
    ])
  })

  it("detects a feed shown as plain text from the DOM without requesting it", async () => {
    const pre = document.createElement("pre")
    pre.textContent = FEED
    document.body.append(pre)

    const { pageRSS } = await getPageRSS()

    expect(fetchSpy).not.toHaveBeenCalled()
    expect(pageRSS).toMatchObject([
      { url: location.href, title: "Example feed" },
    ])
  })
})
