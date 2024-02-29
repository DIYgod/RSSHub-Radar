import _ from "lodash"
import toast from "react-hot-toast"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

const enableFullRemoteRules = !(
  navigator.userAgent.match(/firefox/i) ||
  (navigator.userAgent.match(/safari/i) &&
    !navigator.userAgent.match(/chrome/i))
)
const remoteRulesUrl = enableFullRemoteRules
  ? "https://rsshub.js.org/build/radar-rules.js"
  : "https://rsshub.js.org/build/radar-rules.json"

export const defaultConfig = {
  rsshubDomain: "https://rsshub.app",
  rsshubAccessControl: {
    accessKey: "",
  },
  notice: {
    badge: true,
  },
  submitto: {
    ttrss: false,
    ttrssDomain: "",
    checkchan: false,
    checkchanBase: "",
    miniflux: false,
    minifluxDomain: "",
    freshrss: false,
    freshrssDomain: "",
    nextcloudnews: false,
    nextcloudnewsDomain: "",
    feedly: false,
    inoreader: true,
    inoreaderDomain: "https://www.inoreader.com",
    feedbin: false,
    feedbinDomain: "https://feedbin.com",
    theoldreader: false,
    qireaderDomain: "https://www.qireader.com",
    feedspub: false,
    bazqux: false,
    local: true,
  },
  refreshTimeout: 2 * 60 * 60,
  enableFullRemoteRules,
  remoteRulesUrl,
}

export async function getConfig() {
  let storagedConfig = {}
  try {
    storagedConfig = await storage.get("config")
  } catch (error) {}
  return _.merge({}, defaultConfig, storagedConfig) as typeof defaultConfig
}

let toastId: string | undefined
export async function setConfig(config: Partial<typeof defaultConfig>) {
  let storagedConfig = {}
  try {
    storagedConfig = await storage.get("config")
  } catch (error) {}
  config = _.merge({}, storagedConfig, config)
  await storage.set("config", config)
  toastId = toast.success("Saved", {
    id: toastId,
  })
  return config
}
