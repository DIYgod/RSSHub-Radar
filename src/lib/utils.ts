import { clsx, type ClassValue } from "clsx"
import { decode } from "he"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeFunctionFields(obj) {
  for (var key in obj) {
    if (typeof obj[key] === "function") {
      delete obj[key]
    } else if (typeof obj[key] === "object") {
      removeFunctionFields(obj[key])
    }
  }
}
export function parseRSS(content: string) {
  content = content.replaceAll("&lt;", "<").replaceAll("&gt;", ">")
  if (/<rss(?:\s|>)/i.test(content) || /<feed(?:\s|>)/i.test(content)) {
    const titleContent = content.match(
      /<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/i,
    )?.[1]
    const title = titleContent
      ? decode(titleContent)
          ?.replace(/<!\[CDATA\[([\s\S]*?)]]>/g, (match, p1) => p1)
          ?.trim()
      : ""
    return {
      title,
    }
  } else {
    return null
  }
}

export async function fetchRSSContent(url: string) {
  let content
  try {
    content = await (await fetch(url)).text()
  } catch (error) {
    // TODO
  }
  return content
}

const FEED_PATH_SEGMENT =
  /^(?:feed|feeds|rss|rss2|atom|rdf)(?:\.(?:xml|rss|atom|rdf))?$/i
const FEED_FILE_EXTENSION = /\.(?:xml|rss|atom|rdf)$/i
const FEED_QUERY_VALUE = /^(?:rss|rss2|atom|rdf)$/i

/**
 * Whether a URL looks like a feed address (for example `/feed`, `/rss.xml` or
 * `?feed=rss2`). Ordinary pages such as login forms do not match.
 */
export function isLikelyFeedUrl(url: string) {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch (error) {
    return false
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return false
  }
  if (
    FEED_FILE_EXTENSION.test(parsed.pathname) ||
    parsed.pathname
      .split("/")
      .some((segment) => FEED_PATH_SEGMENT.test(segment))
  ) {
    return true
  }
  for (const value of parsed.searchParams.values()) {
    if (FEED_QUERY_VALUE.test(value)) {
      return true
    }
  }
  return false
}

/**
 * Whether two URLs load the same document, ignoring the protocol (feed links
 * are upgraded to https) and the hash.
 */
export function isSameDocumentUrl(a: string, b: string) {
  try {
    const first = new URL(a)
    const second = new URL(b)
    return (
      first.host === second.host &&
      first.pathname === second.pathname &&
      first.search === second.search
    )
  } catch (error) {
    return false
  }
}

export function getRadarRulesUrl(rsshubDomain: string) {
  return `${rsshubDomain.replace(/\/+$/, "")}/api/radar/rules`
}
