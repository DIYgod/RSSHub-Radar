import type { RSSData } from "./types"
import { parseRSS } from "./utils"

export async function getPageRSS(data: {
  html: string
  url: string
}) {
  const parser = new DOMParser()
  const document = parser.parseFromString(data.html, "text/html")
  const location = new URL(data.url)

  const defaultTitle =
    document.querySelector("title") &&
    document.querySelector("title").innerHTML &&
    document
      .querySelector("title")
      .innerHTML.replace(/<!\[CDATA\[(.*)]]>/, (match, p1) => p1)
      .trim()
  const image =
    (document.querySelector('link[rel~="icon"]') &&
      handleUrl(
        document.querySelector('link[rel~="icon"]').getAttribute("href")
      )) ||
      location.origin + "/favicon.ico"

  function handleUrl(url) {
    return new URL(url.replace(/^(feed:\/\/)/, "https://").replace(/^(feed:)/, ""), location.href).toString()
  }

  let pageRSS: RSSData[] = []
  const unique = {
    data: {},
    save: function (url) {
      this.data[url.replace(/^(https?:\/\/|feed:\/\/|feed:)/, "")] = 1
    },
    check: function (url) {
      return this.data[url.replace(/^(https?:\/\/|feed:\/\/|feed:)/, "")]
    }
  }

  // self rss feed
  let html
  if (
    // Detect RSS without correct Content-Type setting
    // @ts-ignore
    document.body.childNodes?.[0]?.tagName?.toLowerCase() === 'pre'
  ) {
    // @ts-ignore
    html = document.body.childNodes[0].innerText
  } else if (document.querySelector("#webkit-xml-viewer-source-xml")) {
    html = document.querySelector("#webkit-xml-viewer-source-xml").innerHTML
  }

  if (html) {
    const result = parseRSS(html)
    if (result) {
      pageRSS.push({
        url: location.href,
        title: result.title,
        image
      });

      // skip the following check if this page is an RSS feed
      return pageRSS
    }
  }

  // head links
  const types = [
    "application/rss+xml",
    "application/atom+xml",
    "application/rdf+xml",
    "application/rss",
    "application/atom",
    "application/rdf",
    "text/rss+xml",
    "text/atom+xml",
    "text/rdf+xml",
    "text/rss",
    "text/atom",
    "text/rdf",
    "application/feed+json"
  ]
  const links = document.querySelectorAll("link[type]")
  for (let i = 0; i < links.length; i++) {
    if (
      links[i].hasAttribute("type") &&
      types.indexOf(links[i].getAttribute("type")) !== -1
    ) {
      const feed_url = links[i].getAttribute("href")

      if (feed_url) {
        const feed = {
          url: handleUrl(feed_url),
          title: links[i].getAttribute("title") || defaultTitle,
          image
        }
        if (!unique.check(feed.url)) {
          pageRSS.push(feed)
          unique.save(feed.url)
        }
      }
    }
  }

  // prefixed with `feed:`
  const feedEles = document.querySelectorAll("a[href^='feed:']")
  feedEles.forEach((ele) => {
    const feed = {
      url: handleUrl(ele.getAttribute("href")),
      title: ele.getAttribute("title") || defaultTitle,
      image
    }
    if (!unique.check(feed.url)) {
      pageRSS.push(feed)
      unique.save(feed.url)
    }
  })

  // normal a
  const aEles = document.querySelectorAll("a")
  const check = /([^a-zA-Z]|^)rss([^a-zA-Z]|$)/i
  const uncertain = [];
  for (let i = 0; i < aEles.length; i++) {
    if (aEles[i].hasAttribute("href")) {
      const href = aEles[i].getAttribute("href")

      if (
        href.match(/\/(feed|rss|atom)(\.(xml|rss|atom))?\/?$/) ||
        (aEles[i].hasAttribute("title") &&
          aEles[i].getAttribute("title").match(check)) ||
        (aEles[i].hasAttribute("class") &&
          aEles[i].getAttribute("class").match(check)) ||
        (aEles[i].innerText && aEles[i].innerText.match(check))
      ) {
        const feed = {
          url: handleUrl(href),
          title:
            aEles[i].innerText ||
            aEles[i].getAttribute("title") ||
            defaultTitle,
          image,
        }
        if (!unique.check(feed.url)) {
          uncertain.push(feed)
        }
      }
    }
  }
  await Promise.all(uncertain.map((feed) => {
    return new Promise<void>(async (resolve) => {
      try {
        const content = await (await fetch(feed.url, {
          mode: "no-cors",
        })).text()
        const result = parseRSS(content)
        if (result) {
          if (result.title) {
            feed.title = result.title;
          }
          pageRSS.push(feed);
          unique.save(feed.url)
        }
        resolve()
      } catch (error) {
        resolve()
      }
    })
  }))

  return pageRSS
}
