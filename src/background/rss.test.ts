import { randomUUID } from "node:crypto"
import { createServer, type Server } from "node:http"
import type { AddressInfo } from "node:net"
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"

import type { RSSData } from "~/lib/types"

import { deleteCachedRSS, getCachedRSS, getRSS } from "./rss"

vi.mock("~/lib/offscreen", () => ({ setupOffscreenDocument: vi.fn() }))
vi.mock("~/lib/report", () => ({ default: vi.fn() }))
vi.mock("~/lib/storage", () => ({ getLocalStorage: vi.fn(async () => ({})) }))
vi.mock("~/tabs/sandboxes", () => ({
  getRSSHub: vi.fn(() => ({ pageRSSHub: [], websiteRSSHub: [] })),
}))
vi.mock("./badge", () => ({ setBadge: vi.fn() }))

const TAB_ID = 42

// A site like the ones in #1192 and #1193: every GET of the login page starts a
// new session and issues a new CSRF token, so a second GET invalidates the form
// the user already has open.
let server: Server
let origin: string
let hits: Record<string, number>

beforeAll(async () => {
  server = createServer((req, res) => {
    const path = new URL(req.url, "http://localhost").pathname
    hits[path] = (hits[path] ?? 0) + 1

    if (path === "/login") {
      const token = randomUUID()
      res.setHeader("set-cookie", `session=${token}; Path=/; HttpOnly`)
      res.setHeader("content-type", "text/html")
      res.end(
        `<form method="post"><input type="hidden" name="csrf" value="${token}"></form>`,
      )
    } else if (path === "/feed.xml") {
      res.setHeader("content-type", "application/rss+xml")
      res.end(
        `<?xml version="1.0"?><rss version="2.0"><channel><title>Example feed</title></channel></rss>`,
      )
    } else {
      res.statusCode = 404
      res.end()
    }
  })
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
})

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve))
})

const realFetch = globalThis.fetch
const fetchSpy = vi.fn((input: RequestInfo | URL, init?: RequestInit) =>
  realFetch(input, init),
)

type ContentScript = { html: string; pageRSS: RSSData[] }

function stubBrowser({
  contentScript,
  tabStatus = "complete",
}: {
  contentScript?: ContentScript
  tabStatus?: "loading" | "complete"
}) {
  const runtime: { lastError?: { message: string } } = {}
  vi.stubGlobal("chrome", {
    runtime,
    tabs: {
      sendMessage: vi.fn((_tabId, message, callback) => {
        if (!contentScript) {
          runtime.lastError = {
            message:
              "Could not establish connection. Receiving end does not exist.",
          }
          callback(undefined)
          runtime.lastError = undefined
          return
        }
        callback(
          message.name === "requestHTML"
            ? contentScript.html
            : { pageRSS: contentScript.pageRSS },
        )
      }),
      get: vi.fn((tabId, callback) => {
        callback({ id: tabId, status: tabStatus })
      }),
    },
  })
}

beforeEach(() => {
  hits = {}
  fetchSpy.mockClear()
  vi.stubGlobal("fetch", fetchSpy)
})

afterEach(() => {
  deleteCachedRSS(TAB_ID)
  vi.unstubAllGlobals()
})

describe("getRSS", () => {
  it("does not request an ordinary page again when it has no feeds (#1192, #1193)", async () => {
    stubBrowser({
      contentScript: { html: "<html><body>Login</body></html>", pageRSS: [] },
    })

    await getRSS(TAB_ID, `${origin}/login`)

    expect(hits["/login"] ?? 0).toBe(0)
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(getCachedRSS(TAB_ID)?.pageRSS).toEqual([])
  })

  it("does not request a page whose content script is not ready yet", async () => {
    stubBrowser({ tabStatus: "loading" })

    await getRSS(TAB_ID, `${origin}/login`)

    expect(hits["/login"] ?? 0).toBe(0)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it("does not request a loaded page without a content script unless it looks like a feed", async () => {
    stubBrowser({ tabStatus: "complete" })

    await getRSS(TAB_ID, `${origin}/login`)

    expect(hits["/login"] ?? 0).toBe(0)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it("does not probe a feed URL while the tab is still loading", async () => {
    stubBrowser({ tabStatus: "loading" })

    await getRSS(TAB_ID, `${origin}/feed.xml`)

    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it("detects a feed opened in a tab without a content script, without cookies", async () => {
    stubBrowser({ tabStatus: "complete" })

    await getRSS(TAB_ID, `${origin}/feed.xml`)

    expect(hits["/feed.xml"]).toBe(1)
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(fetchSpy.mock.calls[0][1]).toMatchObject({ credentials: "omit" })
    expect(getCachedRSS(TAB_ID)?.pageRSS).toEqual([
      {
        url: `${origin}/feed.xml`,
        title: "Example feed",
        image: "https://icons.duckduckgo.com/ip3/127.0.0.1.ico",
      },
    ])
  })

  it("uses the feeds found by the content script", async () => {
    const feed = {
      url: `${origin}/feed.xml`,
      title: "Example feed",
      image: `${origin}/favicon.ico`,
    }
    stubBrowser({
      contentScript: { html: "<html></html>", pageRSS: [feed] },
    })

    await getRSS(TAB_ID, `${origin}/login`)

    expect(fetchSpy).not.toHaveBeenCalled()
    expect(getCachedRSS(TAB_ID)?.pageRSS).toEqual([feed])
  })
})
