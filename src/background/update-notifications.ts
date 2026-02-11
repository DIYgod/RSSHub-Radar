import RSSHubIcon from "~/assets/icon.png"
import { getLocalStorage, setLocalStorage } from "~/lib/storage"

import info from "../../package.json"

export const initUpdateNotifications = async () => {
  const version = await getLocalStorage("version")
  if (version === info.version) return

  chrome.notifications?.create("RSSHubRadarUpdate", {
    type: "basic",
    iconUrl: RSSHubIcon,
    title: version
      ? chrome.i18n.getMessage("extensionUpdateTip")
      : chrome.i18n.getMessage("extensionInstallTip"),
    message: `v${info.version}, ${chrome.i18n.getMessage("clickToViewChangeLog")}`,
  })
  chrome.notifications?.onClicked.addListener((id) => {
    if (id === "RSSHubRadarUpdate") {
      chrome.tabs.create({
        url: "https://github.com/DIYgod/RSSHub-Radar/releases",
      })
      chrome.notifications?.clear("RSSHubRadarUpdate")
    }
  })
  await setLocalStorage("version", info.version)
}
