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
  zip: {
    // Include only reviewable project inputs, never local builds, credentials,
    // or browser/store screenshots from a maintainer's working directory.
    includeSources: [
      "src/**",
      "public/**",
      "assets/**",
      "package.json",
      "pnpm-lock.yaml",
      "pnpm-workspace.yaml",
      "wxt.config.ts",
      "tsconfig.json",
      "postcss.config.js",
      "tailwind.config.js",
      "README.md",
      "LICENSE",
    ],
  },
  manifest: ({ browser }) => ({
    name: "RSSHub Radar",
    description: "__MSG_extensionDescription__",
    default_locale: "en",
    permissions: [
      "tabs",
      ...(browser === "firefox" ? [] : ["offscreen"]),
      "storage",
      "alarms",
    ],
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
              data_collection_permissions: {
                required: ["none"],
              },
            },
          }
        : undefined,
  }),
})
