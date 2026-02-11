import { defineConfig } from "wxt"

const iconMap = {
  16: "/icon.png",
  32: "/icon.png",
  48: "/icon.png",
  64: "/icon.png",
  128: "/icon.png",
}

export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-react"],
  manifest: ({ browser }) => ({
    name: "RSSHub Radar",
    description: "__MSG_extensionDescription__",
    default_locale: "en",
    permissions: ["tabs", "offscreen", "storage", "alarms"],
    host_permissions: ["https://*/*"],
    optional_permissions: ["notifications"],
    icons: iconMap,
    action: {
      default_icon: iconMap,
    },
    browser_specific_settings:
      browser === "firefox"
        ? {
            gecko: {
              id: "i@diygod.me",
            },
          }
        : undefined,
  }),
})
