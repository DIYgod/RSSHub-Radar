type ReportPayload = {
  url?: string
  name?: string
}

const DEFAULT_URL = "https://radar.rsshub.app"
const PAGE_VIEW_EVENT = "page_view"

function getHostname(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return ""
  }
}

function report({ url = DEFAULT_URL, name }: ReportPayload) {
  const measurementId = import.meta.env.WXT_GA_MEASUREMENT_ID

  if (!measurementId) {
    return
  }

  const eventName = name || PAGE_VIEW_EVENT
  const hostname = getHostname(url)
  const language = chrome?.i18n?.getUILanguage()

  const payload: Record<string, string | number | undefined> = {
    page_location: url,
    page_referrer: hostname,
    page_title: hostname,
    language,
  }

  if (eventName !== PAGE_VIEW_EVENT) {
    payload.event_category = "extension"
    payload.page_path = hostname
  }

  if (typeof window === "undefined") {
    chrome.runtime.sendMessage(
      {
        name: "trackEvent",
        body: {
          name: eventName,
          payload,
        },
      },
      () => {
        void chrome.runtime.lastError
      },
    )
    return
  }

  if (typeof window.gtag !== "function") {
    return
  }

  window.gtag("event", eventName, payload)
}

export default report
