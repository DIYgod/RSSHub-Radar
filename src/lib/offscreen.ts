// https://developer.chrome.com/docs/extensions/reference/api/offscreen
let creating
async function setupOffscreenDocument(path) {
  const offscreenUrl = chrome.runtime.getURL(path)
  // @ts-ignore
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
    documentUrls: [offscreenUrl]
  })

  if (existingContexts.length > 0) {
    return
  }

  if (creating) {
    await creating
  } else {
    creating = chrome.offscreen.createDocument({
      url: chrome.runtime.getURL("tabs/offscreen.html"),
      reasons: [chrome.offscreen.Reason.IFRAME_SCRIPTING],
      justification: "Get RSS in the sandbox for enhanced security."
    })
    await creating
    creating = null
  }
}

export {
  setupOffscreenDocument
}