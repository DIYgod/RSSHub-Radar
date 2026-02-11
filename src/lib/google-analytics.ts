import "url:https://www.googletagmanager.com/gtag/js"

declare global {
  interface Window {
    __RSSHubRadarGAInitialized?: boolean
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function ensureGtagFunction() {
  if (typeof window === "undefined") {
    return false
  }

  window.dataLayer = window.dataLayer || []

  if (typeof window.gtag !== "function") {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args)
    }
  }

  return true
}

export function initGoogleAnalytics() {
  const measurementId = import.meta.env.WXT_GA_MEASUREMENT_ID

  if (!measurementId || typeof window === "undefined") {
    return
  }

  if (!ensureGtagFunction()) {
    return
  }

  if (window.__RSSHubRadarGAInitialized) {
    return
  }

  window.gtag?.("js", new Date())
  window.gtag?.("config", measurementId, {
    send_page_view: false,
  })
  window.__RSSHubRadarGAInitialized = true
}

initGoogleAnalytics()
