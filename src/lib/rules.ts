import md5 from "blueimp-md5"
import _ from "lodash"

import { getConfig } from "./config"
import { defaultRules } from "./radar-rules"
import type { Rules } from "./types"
import { getRadarRulesUrl } from "./utils"

export function parseRules(rules: string, forceJSON?: boolean) {
  let incomeRules: unknown = rules

  if (typeof rules === "string") {
    try {
      incomeRules = JSON.parse(rules)
    } catch (error) {
      incomeRules = forceJSON ? {} : rules
    }
  }

  if (!_.isPlainObject(incomeRules)) {
    incomeRules = {}
  }

  return _.mergeWith({}, defaultRules, incomeRules, (objValue, srcValue) => {
    if (_.isFunction(srcValue)) {
      return srcValue
    } else if (_.isFunction(objValue)) {
      return objValue
    }
  }) as Rules
}

export function getRulesCount(rules: Rules) {
  let index = 0
  Object.keys(rules).map((key) => {
    const rule = rules[key]
    Object.keys(rule).map((item) => {
      if (Array.isArray(rule[item])) {
        index += rule[item].length
      }
    })
  })
  return index
}

export async function getRemoteRules() {
  const config = await getConfig()
  let url = getRadarRulesUrl(config.rsshubDomain)

  if (config.rsshubAccessControl.accessKey?.trim()) {
    const accessKey = config.rsshubAccessControl.accessKey.trim()

    if (config.rsshubAccessControl.accessKeyType === "key") {
      url = `${url}?key=${encodeURIComponent(accessKey)}`
    } else {
      url = `${url}?code=${md5(new URL(url).pathname + accessKey)}`
    }
  }

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch remote rules: ${res.status}`)
  }

  const text = await res.text()
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error("Invalid remote rules response")
  }

  if (!_.isPlainObject(parsed)) {
    throw new Error("Invalid remote rules payload")
  }

  return text
}
