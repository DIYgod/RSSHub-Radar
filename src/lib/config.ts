import _ from "lodash"
import toast from "react-hot-toast"

import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export const defaultConfig = {
  rsshubDomain: "https://rsshub.app",
  rsshubAccessControl: {
    accessKey: "",
    accessKeyType: "code",
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
    local: false,
    follow: true,
  },
  refreshTimeout: 2 * 60 * 60,
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
