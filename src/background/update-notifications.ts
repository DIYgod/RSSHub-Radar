import { Storage } from "@plasmohq/storage"
import info from "../../package.json"
import RSSHubIcon from "data-base64:~/assets/icon.png"

const storage = new Storage({
  area: "local"
})

export const initUpdateNotifications = async () => {
  const version = await storage.get("version");
  if (!version || version !== info.version) {
    chrome.notifications.create('RSSHubRadarUpdate', {
      type: 'basic',
      iconUrl: RSSHubIcon,
      title: version ? chrome.i18n.getMessage('extensionUpdateTip') : chrome.i18n.getMessage('extensionInstallTip'),
      message: `v${info.version}, ${chrome.i18n.getMessage('clickToViewChangeLog')}`,
    });
    chrome.notifications.onClicked.addListener((id) => {
        if (id === 'RSSHubRadarUpdate') {
            chrome.tabs.create({
                url: 'https://github.com/DIYgod/RSSHub-Radar/releases',
            });
            chrome.notifications.clear('RSSHubRadarUpdate');
        }
    });
    await storage.set("version", info.version);
  }
}