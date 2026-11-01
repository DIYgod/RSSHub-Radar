const LEGACY_STORAGE_KEYS = [
  "config",
  "rules",
  "displayedRules",
  "version",
] as const

let legacyStorageMigration: Promise<void> | undefined

/**
 * v2.2.0 moved the extension from Plasmo to WXT. Plasmo stored data in
 * `chrome.storage.sync` as JSON strings, while the new implementation uses
 * `chrome.storage.local` with plain values. Copy the old data over once so
 * existing users keep their settings after upgrading.
 */
export function migrateLegacyStorage() {
  if (!legacyStorageMigration) {
    legacyStorageMigration = migrateLegacyStorageInternal().catch((error) => {
      console.error("Failed to migrate legacy storage", error)
    })
  }
  return legacyStorageMigration
}

async function migrateLegacyStorageInternal() {
  const local = await chrome.storage.local.get(["legacyStorageMigrated"])
  if (local.legacyStorageMigrated) {
    return
  }

  let sync: Record<string, unknown> = {}
  try {
    sync = await chrome.storage.sync.get([...LEGACY_STORAGE_KEYS])
  } catch (error) {
    // Firefox may reject access to the sync area when it is unavailable.
    console.error("Failed to read legacy storage", error)
  }

  const localValues = await chrome.storage.local.get([...LEGACY_STORAGE_KEYS])
  const migrated: Record<string, unknown> = {}

  for (const key of LEGACY_STORAGE_KEYS) {
    if (localValues[key] !== undefined || sync[key] === undefined) {
      continue
    }

    const value = sync[key]
    if (typeof value === "string") {
      try {
        migrated[key] = JSON.parse(value)
      } catch {
        migrated[key] = value
      }
    } else {
      migrated[key] = value
    }
  }

  if (Object.keys(migrated).length > 0) {
    await chrome.storage.local.set(migrated)
  }
  await chrome.storage.local.set({ legacyStorageMigrated: true })
}

export async function getLocalStorage<T = any>(key: string) {
  await migrateLegacyStorage()
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

export async function setLocalStorage<T = any>(key: string, value: T) {
  await migrateLegacyStorage()
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
