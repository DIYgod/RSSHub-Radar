import { setupOffscreenDocument } from "~/lib/offscreen"

const handler = async (message: {
  body?: {
    name?: string
    payload?: Record<string, string | number | undefined>
  }
}) => {
  if (!message?.body?.name) {
    return ""
  }

  if (!chrome.offscreen || !(chrome.runtime as any).getContexts) {
    return ""
  }

  await setupOffscreenDocument("offscreen.html")

  chrome.runtime.sendMessage({
    target: "offscreen",
    data: {
      name: "trackEvent",
      body: message.body,
    },
  })

  return ""
}

export default handler
