import { getConfig } from "~/lib/config"
import { setupOffscreenDocument } from "~/lib/offscreen"
import { getRemoteRules } from "~/lib/rules"
import { getLocalStorage, setLocalStorage } from "~/lib/storage"
import { getDisplayedRules as sandboxGetDisplayedRules } from "~/tabs/sandboxes"

export const refreshRules = async () => {
  const rules = await getRemoteRules()
  await setLocalStorage("rules", rules)
  if (chrome.offscreen && (chrome.runtime as any).getContexts) {
    await setupOffscreenDocument("offscreen.html")
    chrome.runtime.sendMessage({
      target: "offscreen",
      data: {
        name: "requestDisplayedRules",
        body: {
          rules,
        },
      },
    })
  } else {
    const displayedRules = sandboxGetDisplayedRules(rules)
    setDisplayedRules(displayedRules)
  }
  return rules
}

export const getDisplayedRules = () => getLocalStorage("displayedRules")

export const setDisplayedRules = (displayedRules) =>
  setLocalStorage("displayedRules", displayedRules)

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "refreshRulesAlarm") {
    refreshRules()
  }
})

export async function initSchedule() {
  const config = await getConfig()
  const rules = await getLocalStorage("rules")
  if (!rules) {
    setTimeout(() => {
      refreshRules()
    }, 60 * 1000)
  }

  const alarm = await chrome.alarms.get("refreshRulesAlarm")
  if (!alarm) {
    chrome.alarms.create("refreshRulesAlarm", {
      periodInMinutes: config.refreshTimeout / 60,
    })
  }
}
