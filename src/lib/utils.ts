import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import he from "he"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeFunctionFields(obj) {
  for (var key in obj) {
    if (typeof obj[key] === 'function') {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      removeFunctionFields(obj[key]);
    }
  }
}
export function parseRSS(content: string) {
  if (content.includes("<rss ")) {
    const titleContent = content.match(/<title>(.*)<\/title>/)?.[1]
    const title = titleContent ? he.decode(titleContent)?.replace(/<!\[CDATA\[(.*)]]>/, (match, p1) => p1)?.trim() : ""
    return {
      title,
    }
  } else {
    return null
  }
}
