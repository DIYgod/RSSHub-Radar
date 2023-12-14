import { getConfig } from "~/lib/config"

chrome.action.setBadgeBackgroundColor({
  color: '#F62800',
});

chrome.action.setBadgeTextColor({
    color: '#fff',
});

export const setBadge = async (text: string, tabId: number) => {
  const config = await getConfig()
  
  if (config.notice.badge) {
    chrome.action.setBadgeText({
      text,
      tabId,
    });
  }
}