// https://developer.chrome.com/docs/extensions/reference/api/offscreen
let creating: Promise<void> | undefined
let ready: Promise<void> | undefined
let resolveReady: (() => void) | undefined

async function setupOffscreenDocument(path: string) {
  const offscreenUrl = chrome.runtime.getURL(path)

  const existingContexts = (await (chrome.runtime as any).getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"] as any,
    documentUrls: [offscreenUrl],
  })) as chrome.runtime.ExtensionContext[] | undefined

  if (existingContexts?.length) {
    if (ready) {
      await ready
    } else {
      ready = Promise.resolve()
    }
    return
  }

  ready ??= new Promise<void>((resolve) => {
    resolveReady = resolve
  })

  if (creating) {
    await creating
  } else {
    const createPromise = chrome.offscreen.createDocument({
      url: offscreenUrl,
      reasons: [chrome.offscreen.Reason.IFRAME_SCRIPTING],
      justification: "Get RSS in the sandbox for enhanced security.",
    })
    creating = createPromise
    try {
      await createPromise
    } catch (error) {
      ready = undefined
      resolveReady = undefined
      throw error
    } finally {
      creating = undefined
    }
  }

  await ready
}

function markOffscreenReady() {
  resolveReady?.()
  resolveReady = undefined
}

export { markOffscreenReady, setupOffscreenDocument }
