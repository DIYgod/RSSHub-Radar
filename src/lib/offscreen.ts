// https://developer.chrome.com/docs/extensions/reference/api/offscreen
let creating

async function setupOffscreenDocument(path: string) {
  const offscreenUrl = chrome.runtime.getURL(path)

  const existingContexts = (await (chrome.runtime as any).getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"] as any,
    documentUrls: [offscreenUrl],
  })) as chrome.runtime.ExtensionContext[] | undefined

  if (existingContexts?.length) {
    return
  }

  if (creating) {
    await creating
  } else {
    creating = chrome.offscreen.createDocument({
      url: offscreenUrl,
      reasons: [chrome.offscreen.Reason.IFRAME_SCRIPTING],
      justification: "Get RSS in the sandbox for enhanced security.",
    })
    await creating
    creating = null
  }
}

export { setupOffscreenDocument }
