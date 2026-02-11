export function getLocalStorage<T = any>(key: string) {
  return new Promise<T>((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }

      resolve(result[key] as T)
    })
  })
}

export function setLocalStorage<T = any>(key: string, value: T) {
  return new Promise<void>((resolve, reject) => {
    chrome.storage.local.set(
      {
        [key]: value,
      },
      () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
          return
        }

        resolve()
      },
    )
  })
}
