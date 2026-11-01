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

export function getRadarRulesUrl(rsshubDomain: string) {
  return `${rsshubDomain.replace(/\/+$/, "")}/api/radar/rules`
}
