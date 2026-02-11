export type ExtensionMessage = {
  name: string
  body?: any
}

export function sendToBackground<T = any>(message: ExtensionMessage) {
  return new Promise<T>((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve(response as T)
    })
  })
}

export function sendToContentScript<T = any>({
  name,
  tabId,
  body,
}: {
  name: string
  tabId: number
  body?: any
}) {
  return new Promise<T>((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { name, body }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve(response as T)
    })
  })
}
