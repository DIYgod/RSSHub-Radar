import { Storage } from "@plasmohq/storage"
import { getRemoteRules } from "~/lib/rules"

const storage = new Storage({
  area: "local"
})

export const refreshRules = async () => {
  const rules = await getRemoteRules()
  await storage.set("rules", rules)
  chrome.runtime.sendMessage({
    target: "offscreen",
    data: {
      name: "requestDisplayedRules",
      body: {
        rules,
      }
    }
  })
  return rules
}

export const getDisplayedRules = () => storage.get("displayedRules")

export const setDisplayedRules = (displayedRules) => storage.set("displayedRules", displayedRules)
